import { Injectable } from '@nestjs/common';
import { JwtService } from '@/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user): Promise<string> {
    const userId = user.id;
    const username = user.username;
    const payload = { userId, username };
    return this.jwtService.generateToken(payload);
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verifyToken(token);

      return !!decoded;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
