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
   * ✅ Create a new order from frontend cart
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
          `Quantity for ${item.title} exceeds available stock`,
        );
      }
    }

    const formattedItems = items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    }));

    const newOrder = new this.orderModel({
      userId,
      items: formattedItems,
      totalAmount: grandTotal,
    });

    const savedOrder = await newOrder.save();

    this.eventEmitter.emit('order.created', {
      order: savedOrder,
    });

    return savedOrder;
  }

  /**
   * ✅ Get all orders (admin)
   */
  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate({
        path: 'items.product',
        populate: [
          {
            path: 'farm',
            model: 'User',
            select: 'username email phone_no',
          },
          {
            path: 'category',
            model: 'Category',
            select: 'name',
          },
        ],
        select: 'title price category farm',
      })
      .populate({
        path: 'userId',
        select: 'username email phone_no',
      })
      .exec();
  }

  /**
   * ✅ Get one order by ID
   */
  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate({
        path: 'items.product',
        populate: [
          {
            path: 'farm',
            model: 'User',
            select: 'username email phone_no',
          },
          {
            path: 'category',
            model: 'Category',
            select: 'name',
          },
        ],
        select: 'title price category farm',
      })
      .populate({
        path: 'userId',
        select: 'username email phone_no',
      })
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  /**
   * ✅ Update order
   */
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return updatedOrder;
  }

  /**
   * ✅ Delete order
   */
  async remove(id: string): Promise<Order> {
    this.logger.warn(`Attempting to delete order with ID: ${id}`);

    const deletedOrder = await this.orderModel.findByIdAndDelete(id).exec();

    if (!deletedOrder) {
      this.logger.error(`Order with ID ${id} not found`);
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    this.logger.log(`Order with ID ${id} successfully deleted`);

    return deletedOrder;
  }

  /**
   * ✅ User's own orders
   */
  async findByVendor(vendorId: string): Promise<Order[]> {
    return this.orderModel
      .find({ userId: vendorId })
      .populate({
        path: 'items.product',
        populate: [
          {
            path: 'farm',
            model: 'User',
            select: 'username email phone_no',
          },
          {
            path: 'category',
            model: 'Category',
            select: 'name',
          },
        ],
        select: 'title price category farm',
      })
      .populate({
        path: 'userId',
        select: 'username email phone_no',
      })
      .exec();
  }

  /**
   * ✅ Farmer: View orders placed on their products
   */
  async findOrdersForFarmer(farmerId: string): Promise<Order[]> {
    const orders = await this.orderModel
      .find()
      .populate({
        path: 'items.product',
        populate: [
          {
            path: 'farm',
            model: 'User',
            select: 'username email phone_no',
          },
          {
            path: 'category',
            model: 'Category',
            select: 'name',
          },
        ],
        select: 'title price category farm',
      })
      .populate({
        path: 'userId',
        select: 'username email phone_no',
      })
      .exec();

    return orders.filter((order) =>
      order.items.some(
        (item) => (item.product as any)?.farm?._id?.toString() === farmerId,
      ),
    );
  }

  /**
   * ✅ Notify farmers of new order (mock)
   */
  async notifyFarmerOfOrder(id: string) {
    const order = await this.findOne(id);

    const productIds = order.items.map((i) => i.product);
    this.logger.log(`Notify farmers for order ${id} - Products: ${productIds}`);

    return {
      message: 'Notification logic executed (mock)',
      orderId: id,
    };
  }

  /**
   * ✅ Remove a product from an order
   */
  async removeProductFromOrder(
    orderId: string,
    productId: string,
  ): Promise<Order> {
    const order = await this.orderModel.findById(orderId).exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const filteredItems = order.items.filter(
      (item) => item.product.toString() !== productId,
    );

    if (filteredItems.length === order.items.length) {
      throw new NotFoundException(`Product ${productId} not found in order`);
    }

    order.items = filteredItems;

    // Recalculate total
    let newTotal = 0;
    for (const item of filteredItems) {
      const product = await this.farmService.findOne(item.product.toString());
      newTotal += product.price * item.quantity;
    }

    order.totalAmount = newTotal;

    const updatedOrder = await order.save();
    this.logger.log(`Removed product ${productId} from order ${orderId}`);

    return updatedOrder.populate([
      {
        path: 'items.product',
        populate: [
          { path: 'farm', model: 'User', select: 'username email phone_no' },
          { path: 'category', model: 'Category', select: 'name' },
        ],
      },
      { path: 'userId', select: 'username email phone_no' },
    ]);
  }
}
