// src/auth/dto/register.dto.ts

import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { Role } from '../entities/auth.schema';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('KE') // uses default region — or you can set: 'KE', 'US', etc.  phone_no: string;
  phone_no: string;
  
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'role must be either user or admin' })
  role?: Role; // Optional; defaults to 'user' in schema
}
