// src/auth/auth.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone_no: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Role.User, enum: Role })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('timestamps', true); // Optional: adds createdAt & updatedAt
