import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './entities/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FarmService } from '../farm/farm.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly farmService: FarmService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Handles creation of an order from the frontend cart
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, userId, grandTotal } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    for (const item of items) {
      const product = await this.farmService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.title} not found`);
      }

      if (item.quantity > product.quantity) {
        throw new BadRequestException(
          `Quantity for ${item.title} exceeds available stock`
        );
      }
    }

    const newOrder = new this.orderModel({
      userId,
      items,
      grandTotal,
      status: 'pending',
      orderDate: new Date(),
    });

    const savedOrder = await newOrder.save();

    this.eventEmitter.emit('order.created', {
      order: savedOrder,
    });

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('userId')
      .populate('items.productId')
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('userId')
      .populate('items.productId')
      .exec();

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
      .find({ userId: vendorId })
      .populate('userId')
      .populate('items.productId')
      .exec();
  }

  async notifyFarmerOfOrder(id: string) {
    const order = await this.findOne(id);

    // Optional: Extract all farmer contacts from order items
    const productIds = order.items.map(i => i.productId);
    this.logger.log(`Notify farmers for order ${id} - Products: ${productIds}`);

    // Trigger notification logic here (e.g., via event, SMS, email...)
    return {
      message: 'Notification logic executed (mock)',
      orderId: id,
    };
  }
}
