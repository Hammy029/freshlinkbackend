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
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  // Public: View all available products (no auth required)
  @Get()
  findAllAvailable() {
    return this.farmService.findAllAvailable();
  }

  // Protected endpoints below:

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  @Roles(Role.User)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFarmDto: CreateFarmDto, @Req() req) {
    return this.farmService.create({ ...createFarmDto, farm: req.user._id });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin-products')
  @Roles(Role.Admin)
  findAll() {
    return this.farmService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('my-products')
  @Roles(Role.User)
  getMyProducts(@Req() req) {
    return this.farmService.findByUser(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(Role.User, Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateFarmDto: UpdateFarmDto,
    @Req() req,
  ) {
    return this.farmService.update(id, updateFarmDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/sold')
  @Roles(Role.User, Role.Admin)
  markAsSold(@Param('id') id: string) {
    return this.farmService.markAsSold(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.User, Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req) {
    return this.farmService.remove(id, req.user);
  }
}
