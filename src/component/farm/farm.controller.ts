import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  // ✅ Public: Get all available products (for non-authenticated users)
  @Get('public')
  findAllPublic() {
    return this.farmService.findAllPublic();
  }

  // ✅ Authenticated: Create a farm product (linked to current user)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFarmDto: CreateFarmDto, @Req() req) {
    return this.farmService.create({ ...createFarmDto, farm: req.user._id });
  }

  // ✅ Admin: Get all products (assumes frontend filters admin role)
  @UseGuards(JwtAuthGuard)
  @Get('admin-products')
  findAll(@Req() req) {
    return this.farmService.findAll();
  }

  // ✅ Admin: Get raw DB data (for backend inspection)
  @UseGuards(JwtAuthGuard)
  @Get('raw-all')
  getRawAllFarms(@Req() req) {
    return this.farmService.findAll();
  }

  // ✅ Authenticated User: Get own products
  @UseGuards(JwtAuthGuard)
  @Get('my-products')
  getMyProducts(@Req() req) {
    return this.farmService.findByUser(req.user._id);
  }

  // ✅ Any Authenticated User: Get product by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmService.findOne(id);
  }

  // ✅ Authenticated User: Update product (owner or admin)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto, @Req() req) {
    return this.farmService.update(id, updateFarmDto, req.user);
  }

  // ✅ Authenticated User: Mark product as sold (owner or admin)
  @UseGuards(JwtAuthGuard)
  @Patch(':id/sold')
  markAsSold(@Param('id') id: string, @Req() req) {
    return this.farmService.markAsSold(id);
  }

  // ✅ Authenticated User: Delete product (owner or admin)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.farmService.remove(id, req.user);
  }
}
