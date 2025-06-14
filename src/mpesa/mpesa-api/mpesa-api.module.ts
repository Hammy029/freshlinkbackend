import { Module } from '@nestjs/common';
import { MpesaApiService } from './mpesa-api.service';
import { MpesaApiController } from './mpesa-api.controller';

@Module({
  controllers: [MpesaApiController],
  providers: [MpesaApiService],
})
export class MpesaApiModule {}
