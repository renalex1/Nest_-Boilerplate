import { Injectable } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secretKey = process.env.JWT_SECRET;
  private readonly expiresIn = process.env.JWT_EXPIRES_IN;

  generateToken(payload: Record<string, any>): string {
    return sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  verifyToken(token: string): Record<string, object> {
    try {
      const tokenWithoutBearer = token.startsWith('Bearer ')
        ? token.slice(7)
        : token;

      return verify(tokenWithoutBearer, this.secretKey) as Record<
        string,
        object
      >;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
