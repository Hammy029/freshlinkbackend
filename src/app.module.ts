import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FarmModule } from './component/farm/farm.module';
import { OrderModule } from './component/order/order.module';
import { CategoryModule } from './component/component/category/category.module';
import { CartModule } from './component/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // make ConfigService available globally
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // get from .env
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    FarmModule,
    OrderModule,
    CategoryModule,
    CartModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
