import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@/jwt/jwt.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthResolver, JwtService],
})
export class AuthModule {}
