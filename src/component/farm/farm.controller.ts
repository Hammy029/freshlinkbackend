import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('farm')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  // 👨‍🌾 User or 👑 Admin: Create product
  @Post()
  @Roles(Role.User, Role.Admin)  // Allow both roles
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFarmDto: CreateFarmDto, @Req() req) {
    console.log('Create farm by user role:', req.user.role);
    return this.farmService.create({ ...createFarmDto, farm: req.user._id });
  }

  // 👑 Admin: View all products
  @Get('admin-products')
  @Roles(Role.Admin)
  findAll(@Req() req) {
    console.log('Find all by user role:', req.user.role);
    return this.farmService.findAll();
  }

  // 👨‍🌾 User: View own products
  @Get('my-products')
  @Roles(Role.User)
  getMyProducts(@Req() req) {
    console.log('Get my products by user role:', req.user.role);
    return this.farmService.findByUser(req.user._id);
  }

  // 🔍 Anyone authenticated: Get product by ID
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    console.log('Find one product requested by user role:', req.user.role);
    return this.farmService.findOne(id);
  }

  // ✏️ Admin or owner: Update
  @Patch(':id')
  @Roles(Role.User, Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateFarmDto: UpdateFarmDto,
    @Req() req,
  ) {
    console.log('Update product by user role:', req.user.role);
    return this.farmService.update(id, updateFarmDto, req.user);
  }

  // ✅ Admin or owner: Mark as sold
  @Patch(':id/sold')
  @Roles(Role.User, Role.Admin)
  markAsSold(@Param('id') id: string, @Req() req) {
    console.log('Mark as sold by user role:', req.user.role);
    return this.farmService.markAsSold(id);
  }

  // 🗑️ Admin or owner: Delete
  @Delete(':id')
  @Roles(Role.User, Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req) {
    console.log('Delete product by user role:', req.user.role);
    return this.farmService.remove(id, req.user);
  }
}
