import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FarmService } from '../farm/farm.service'; 
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrderService {
  notifyFarmerOfOrder(id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly farmService: FarmService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validate product existence
    const product = await this.farmService.findOne(createOrderDto.product);
    if (!product) {
      throw new NotFoundException(`Product with id ${createOrderDto.product} not found`);
    }

    // Check requested quantity against available quantity
    if (createOrderDto.quantity > product.quantity) {
      throw new BadRequestException(
        `Requested quantity (${createOrderDto.quantity}) exceeds available stock (${product.quantity})`
      );
    }

    const createdOrder = new this.orderModel({
      ...createOrderDto,
      status: 'pending',
      orderDate: new Date(),
    });

    const savedOrder = await createdOrder.save();

    // Emit an event for order creation (e.g., notify farmer)
    this.eventEmitter.emit('order.created', { order: savedOrder, product });

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('product').populate('vendor').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('product').populate('vendor').exec();
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();
    if (!deletedOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return deletedOrder;
  }

  async findByVendor(vendorId: string): Promise<Order[]> {
    return this.orderModel
      .find({ vendor: vendorId })
      .populate('product')
      .populate('vendor')
      .exec();
  }
}
