// src/component/order/dto/create-order.dto.ts

import { IsNotEmpty, IsMongoId, IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId({ message: 'Invalid vendor ID' })
  vendor: string;

  @IsMongoId({ message: 'Invalid product ID' })
  product: string;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsOptional()
  @IsString()
  notes?: string; // Optional note from vendor to farmer
}
