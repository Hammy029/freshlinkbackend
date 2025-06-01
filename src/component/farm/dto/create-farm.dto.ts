import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsMongoId
} from 'class-validator';

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsMongoId()
  @IsNotEmpty()
  category: string;

  @IsMongoId()
  @IsNotEmpty()
  farm: string; // ID of the User or Farmer posting the product

  @IsString()
  @IsOptional()
  status?: string; // Optional status field
}
