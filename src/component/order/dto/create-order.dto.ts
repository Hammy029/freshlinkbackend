// src/component/order/dto/create-order.dto.ts
import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId()
  vendor: string;

  @IsMongoId()
  product: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
