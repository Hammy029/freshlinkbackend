import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Farm extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  quantity: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: MongooseSchema.Types.ObjectId;

  // ✅ Reference to User collection
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  farm: MongooseSchema.Types.ObjectId;

  // ✅ Optional image URL for the product
  @Prop()
  imageUrl: string;

  // ✅ Status field to track availability
  @Prop({ default: 'Available' })
  status: 'Available' | 'Sold';

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FarmSchema = SchemaFactory.createForClass(Farm);
