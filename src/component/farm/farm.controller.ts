import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  // Create a product
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.create(createFarmDto);
  }

  // Get all products
  @Get()
  findAll() {
    return this.farmService.findAll();
  }

  // Get a single product by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmService.findOne(id);
  }

  // Update product (e.g. after editing)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmService.update(id, updateFarmDto);
  }

  // Mark product as Sold
  @Patch(':id/sold')
  markAsSold(@Param('id') id: string) {
    return this.farmService.markAsSold(id);
  }

  // Delete a product
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.farmService.remove(id);
  }
}
