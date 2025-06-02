import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { Farm, FarmSchema } from './entities/farm.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Farm.name, schema: FarmSchema }]),
  ],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],  // <-- Export FarmService so it can be used in other modules
})
export class FarmModule {}
