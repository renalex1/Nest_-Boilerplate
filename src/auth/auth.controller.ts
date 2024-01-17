import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  async login(@Req() req, @Res() res): Promise<void> {
    const user = { id: 1, username: 'exampleUser' };
    const token = await this.authService.login(user);
    return res.json({ token });
  }
}
