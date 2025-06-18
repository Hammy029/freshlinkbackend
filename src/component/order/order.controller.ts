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

  // ✅ Create new order with vendor auto-attached from logged-in user
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request & { user: any },
  ) {
    const vendorId = req.user._id;
    return this.orderService.create({ ...createOrderDto, userId: vendorId });
  }

  // ✅ Get all orders - for admin use or dashboard aggregation
  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  // ✅ Get all orders for logged-in user (vendor or customer)
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async findOrdersByVendor(@Req() req: Request & { user: any }) {
    const vendorId = req.user._id;
    return this.orderService.findByVendor(vendorId);
  }

  // ✅ Get single order by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // ✅ Update order by ID - guarded
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: Request & { user: any },
  ) {
    // Optional: verify user ownership or admin privileges here
    return this.orderService.update(id, updateOrderDto);
  }

  // ✅ Delete order by ID - guarded
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request & { user: any }) {
    // Optional: verify user ownership or admin privileges here
    return this.orderService.remove(id);
  }

  // ✅ Custom route: notify farmer of order (optional logic in service)
  @UseGuards(JwtAuthGuard)
  @Post(':id/notify-farmer')
  async notifyFarmer(@Param('id') id: string) {
    return this.orderService.notifyFarmerOfOrder(id);
  }
}
