import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsIn,
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

  // Made optional because assigned on backend (from req.user._id)
  @IsMongoId()
  @IsOptional()
  farm?: string; // ID of the User or Farmer posting the product

  @IsString()
  @IsOptional()
  @IsIn(['Available', 'Sold'])
  status?: 'Available' | 'Sold'; // Optional status field with allowed values
}
