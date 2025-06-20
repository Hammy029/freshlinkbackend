import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  /**
   * ✅ Create a new order — user ID is extracted from JWT
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request & { user: any },
  ) {
    const userId = req.user._id;
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
   * ✅ Authenticated user: Get only their orders
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async findOrdersByVendor(@Req() req: Request & { user: any }) {
    const userId = req.user._id;
    return this.orderService.findByVendor(userId);
  }

  /**
   * ✅ Farmer: View orders placed on products posted by this farmer
   */
  @UseGuards(JwtAuthGuard)
  @Get('farmer-orders')
  async getFarmerOrders(@Req() req: Request & { user: any }) {
    const farmerId = req.user._id;
    return this.orderService.findOrdersForFarmer(farmerId);
  }

  /**
   * ✅ Public/guarded single order fetch
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  /**
   * ✅ Update an order — optionally validate ownership/admin
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: Request & { user: any },
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  /**
   * ✅ Cancel/Delete an order
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request & { user: any }) {
    this.logger.warn(`Cancel requested for order ID: ${id} by user: ${req.user._id}`);
    return this.orderService.remove(id);
  }

  /**
   * ✅ Remove a product from an order (new feature)
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':orderId/remove-item/:productId')
  async removeItemFromOrder(
    @Param('orderId') orderId: string,
    @Param('productId') productId: string,
    @Req() req: Request & { user: any },
  ) {
    this.logger.log(`User ${req.user._id} removing product ${productId} from order ${orderId}`);
    return this.orderService.removeProductFromOrder(orderId, productId);
  }

  /**
   * ✅ Custom: Notify farmer(s) after an order is placed
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/notify-farmer')
  async notifyFarmer(@Param('id') id: string) {
    return this.orderService.notifyFarmerOfOrder(id);
  }
}
