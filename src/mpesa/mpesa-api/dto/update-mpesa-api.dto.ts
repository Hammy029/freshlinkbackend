import { PartialType } from '@nestjs/mapped-types';
import { CreateMpesaApiDto } from './create-mpesa-api.dto';

export class UpdateMpesaApiDto extends PartialType(CreateMpesaApiDto) {}
