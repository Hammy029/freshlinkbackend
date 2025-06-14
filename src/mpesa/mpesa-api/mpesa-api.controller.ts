import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MpesaApiService } from './mpesa-api.service';
import { CreateMpesaApiDto } from './dto/create-mpesa-api.dto';
import { UpdateMpesaApiDto } from './dto/update-mpesa-api.dto';

@Controller('mpesa-api')
export class MpesaApiController {
  constructor(private readonly mpesaApiService: MpesaApiService) {}

  @Post()
  create(@Body() createMpesaApiDto: CreateMpesaApiDto) {
    return this.mpesaApiService.create(createMpesaApiDto);
  }

  @Get()
  findAll() {
    return this.mpesaApiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mpesaApiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMpesaApiDto: UpdateMpesaApiDto) {
    return this.mpesaApiService.update(+id, updateMpesaApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mpesaApiService.remove(+id);
  }
}
