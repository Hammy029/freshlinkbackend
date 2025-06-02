// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './entities/auth.schema';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';  // <-- Import JwtStrategy

@Module({
  imports: [
    ConfigModule, // optional if global, but included for safety
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Add PassportModule for auth strategies
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy], // <-- Added JwtStrategy here
  exports: [AuthService],
})
export class AuthModule {}
