import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

  @Prop({ type: Number, required: true })
  totalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
