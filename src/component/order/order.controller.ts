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
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
//import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // ✅ Adjust path if needed

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  /**
   * ✅ Protected: Create a new order — gets userId from token, not body
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: any,
  ) {
    const userId = req.user._id; // ✅ secure from JWT
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
   * ✅ Protected: Get orders for currently authenticated user
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async findOrdersByVendor(@Req() req: any) {
    const userId = req.user._id;
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
   * ✅ Update an order — still public (optionally protect later)
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
   * ✅ Cancel/Delete an order — still public (optionally protect later)
   */
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    this.logger.warn(`Cancel requested for order ID: ${id}`);
    return this.orderService.remove(id);
  }

  /**
   * ✅ Remove a product from an order (unprotected)
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
