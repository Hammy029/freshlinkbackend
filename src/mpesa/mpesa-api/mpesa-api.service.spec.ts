import { Test, TestingModule } from '@nestjs/testing';
import { MpesaApiService } from './mpesa-api.service';

describe('MpesaApiService', () => {
  let service: MpesaApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MpesaApiService],
    }).compile();

    service = module.get<MpesaApiService>(MpesaApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
