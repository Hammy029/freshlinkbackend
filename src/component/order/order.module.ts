import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './entities/order.schema';
import { FarmModule } from '../farm/farm.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    FarmModule,
    EventEmitterModule.forRoot(),  // <- add this line
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
