import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, UsersModule],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
