// src/component/order/entities/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })  // vendor placing the order
  vendor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Farm', required: true })  // farm product
  product: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: 'pending', enum: ['pending', 'confirmed', 'delivered', 'cancelled'] })
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';

  @Prop({ default: Date.now })
  orderDate: Date;

  @Prop()
  notes?: string;  // optional vendor message
}

export const OrderSchema = SchemaFactory.createForClass(Order);
