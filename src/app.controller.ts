import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@/jwt/jwt.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('token')
  getToken(): string {
    const user = { id: 1, username: 'example' };
    const token = this.jwtService.generateToken(user);
    return token;
  }

  @Get('/verify/:token')
  verifyToken(@Param('token') token: string): string {
    const decoded = this.jwtService.verifyToken(token);
    return `Token is valid. Decoded payload: ${JSON.stringify(decoded)}`;
  }
}
