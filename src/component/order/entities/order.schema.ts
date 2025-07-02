import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { Document, Types } from 'mongoose';
import {
  CustomerInfoDto,
  PaymentInfoDto,
  OrderDetailsDto,
} from '../dto/create-order.dto';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Farm', required: true }, // ✅ Updated from 'Product' to 'Farm'
      quantity: { type: Number, required: true },
    },
  ])
  items: {
    product: Types.ObjectId;
    quantity: number;
  }[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customerInfo?: CustomerInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentInfoDto)
  paymentInfo?: PaymentInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OrderDetailsDto)
  orderDetails?: OrderDetailsDto;

  @Prop({ type: Number, required: true })
  totalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
