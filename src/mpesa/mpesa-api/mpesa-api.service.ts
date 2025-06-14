import { Injectable } from '@nestjs/common';
import { CreateMpesaApiDto } from './dto/create-mpesa-api.dto';
import { UpdateMpesaApiDto } from './dto/update-mpesa-api.dto';

@Injectable()
export class MpesaApiService {
  create(createMpesaApiDto: CreateMpesaApiDto) {
    return 'This action adds a new mpesaApi';
  }

  findAll() {
    return `This action returns all mpesaApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mpesaApi`;
  }

  update(id: number, updateMpesaApiDto: UpdateMpesaApiDto) {
    return `This action updates a #${id} mpesaApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} mpesaApi`;
  }
}
