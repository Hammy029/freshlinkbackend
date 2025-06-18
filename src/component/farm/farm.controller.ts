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

  @Get('public')
  findAllPublic() {
    return this.farmService.findAllPublic();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFarmDto: CreateFarmDto, @Req() req) {
    return this.farmService.create({ ...createFarmDto, farm: req.user._id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin-products')
  findAll(@Req() req) {
    return this.farmService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('raw-all')
  getRawAllFarms(@Req() req) {
    return this.farmService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-products')
  getMyProducts(@Req() req) {
    return this.farmService.findByUser(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto, @Req() req) {
    return this.farmService.update(id, updateFarmDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/sold')
  markAsSold(@Param('id') id: string, @Req() req) {
    return this.farmService.markAsSold(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.farmService.remove(id, req.user);
  }

  // ✅ Public: Search product by ID and get owner contact
  @Get('search/:id')
  getProductWithOwner(@Param('id') id: string) {
    return this.farmService.findProductWithOwner(id);
  }
}
