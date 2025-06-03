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
  ForbiddenException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create order with vendorId from JWT user
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request & { user: any },
  ) {
    const vendorId = req.user._id;
    return await this.orderService.create({ ...createOrderDto, vendor: vendorId });
  }

  // Get all orders (could restrict to admin only in future)
  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  // Get all orders for logged-in vendor - placed before :id routes to avoid conflict
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async findOrdersByVendor(@Req() req: Request & { user: any }) {
    const vendorId = req.user._id;
    return await this.orderService.findByVendor(vendorId);
  }

  // Get single order by id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(id);
  }

  // Update order by id - Add guard and ownership check if needed
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: Request & { user: any },
  ) {
    // Optional: Add ownership/admin check here before updating
    return await this.orderService.update(id, updateOrderDto);
  }

  // Delete order by id - Add guard and ownership check if needed
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request & { user: any }) {
    // Optional: Add ownership/admin check here before deleting
    return await this.orderService.remove(id);
  }

  // Optional: Notify farmer manually (if implemented in service)
  @UseGuards(JwtAuthGuard)
  @Post(':id/notify-farmer')
  async notifyFarmer(@Param('id') id: string) {
    return this.orderService.notifyFarmerOfOrder(id);
  }
}
