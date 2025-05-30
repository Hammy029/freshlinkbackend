// src/component/order/entities/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Farm', required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';

  @Prop()
  orderDate: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
