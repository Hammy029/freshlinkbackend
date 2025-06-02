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
//import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
//import { Role } from 'src/auth/auth.schema';

@Controller('farm')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  // 👨‍🌾 User: Create product
  @Post()
  @Roles(Role.User)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFarmDto: CreateFarmDto, @Req() req) {
    return this.farmService.create({ ...createFarmDto, farm: req.user._id });
  }

  // 👑 Admin: View all products
  @Get('admin-products')
  @Roles(Role.Admin)
  findAll() {
    return this.farmService.findAll();
  }

  // 👨‍🌾 User: View own products
  @Get('my-products')
  @Roles(Role.User)
  getMyProducts(@Req() req) {
    return this.farmService.findByUser(req.user._id);
  }

  // 🔍 Anyone authenticated: Get product by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
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
    return this.farmService.update(id, updateFarmDto, req.user);
  }

  // ✅ Admin or owner: Mark as sold
  @Patch(':id/sold')
  @Roles(Role.User, Role.Admin)
  markAsSold(@Param('id') id: string) {
    return this.farmService.markAsSold(id);
  }

  // 🗑️ Admin or owner: Delete
  @Delete(':id')
  @Roles(Role.User, Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req) {
    return this.farmService.remove(id, req.user);
  }
}
