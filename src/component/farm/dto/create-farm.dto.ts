import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsMongoId,
  IsIn,
  IsUrl,
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

  // Automatically attached on backend from req.user._id
  @IsMongoId()
  @IsOptional()
  farm?: string;

  @IsString()
  @IsOptional()
  @IsIn(['Available', 'Sold'])
  status?: 'Available' | 'Sold';

  @IsUrl()
  @IsOptional()
  imageUrl?: string;
}
