import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Logger,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  /**
   * ✅ Create a new order — now expects userId from CreateOrderDto body
   */
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request,
  ) {
    const userId = createOrderDto.userId;
    return this.orderService.create({ ...createOrderDto, userId });
  }

  /**
   * ✅ Admin: Get all orders (with user & product population)
   */
  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  /**
   * ✅ Unprotected: Get orders by userId query param
   */
  @Get('my-orders')
  async findOrdersByVendor(@Req() req: Request) {
    const userId = req.query.userId as string;
    return this.orderService.findByVendor(userId);
  }

  /**
   * ✅ Unprotected: View orders placed on products posted by this farmer
   */
  @Get('farmer-orders')
  async getFarmerOrders(@Req() req: Request) {
    const farmerId = req.query.farmerId as string;
    return this.orderService.findOrdersForFarmer(farmerId);
  }

  /**
   * ✅ Public single order fetch
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  /**
   * ✅ Update an order — now public
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  /**
   * ✅ Cancel/Delete an order — now public
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    this.logger.warn(`Cancel requested for order ID: ${id}`);
    return this.orderService.remove(id);
  }

  /**
   * ✅ Remove a product from an order (now unprotected)
   */
  @Patch(':orderId/remove-item/:productId')
  async removeItemFromOrder(
    @Param('orderId') orderId: string,
    @Param('productId') productId: string,
    @Req() req: Request,
  ) {
    this.logger.log(`Removing product ${productId} from order ${orderId}`);
    return this.orderService.removeProductFromOrder(orderId, productId);
  }

  /**
   * ✅ Notify farmer(s) after an order is placed (now public)
   */
  @Post(':id/notify-farmer')
  async notifyFarmer(@Param('id') id: string) {
    return this.orderService.notifyFarmerOfOrder(id);
  }
}
