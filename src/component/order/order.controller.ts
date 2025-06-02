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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create order, vendorId from JWT
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request & { user: any }) {
    const vendorId = req.user['_id'];
    return this.orderService.create({ ...createOrderDto, vendor: vendorId });
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  // Get all orders for logged-in vendor
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  findOrdersByVendor(@Req() req: Request & { user: any }) {
    const vendorId = req.user['_id'];
    return this.orderService.findByVendor(vendorId);
  }

  // Optional: Notify farmer manually (if implemented in service)
  @UseGuards(JwtAuthGuard)
  @Post(':id/notify-farmer')
  notifyFarmer(@Param('id') id: string) {
    return this.orderService.notifyFarmerOfOrder(id);
  }
}
