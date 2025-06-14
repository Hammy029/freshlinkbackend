import { Test, TestingModule } from '@nestjs/testing';
import { MpesaApiController } from './mpesa-api.controller';
import { MpesaApiService } from './mpesa-api.service';

describe('MpesaApiController', () => {
  let controller: MpesaApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MpesaApiController],
      providers: [MpesaApiService],
    }).compile();

    controller = module.get<MpesaApiController>(MpesaApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
