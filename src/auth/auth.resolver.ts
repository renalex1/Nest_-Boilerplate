import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { TokenInput } from './dto/token.input';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  async login(): Promise<string> {
    const user = { id: 1, username: 'exampleUser' };
    const payload = {
      userId: user.id,
      username: user.username,
      date: new Date(),
    };
    return this.authService.login(payload);
  }

  @Query(() => Boolean, { name: 'verifyToken' })
  async verifyToken(@Args('input') input: TokenInput): Promise<any> {
    const user = await this.authService.verifyToken(input.token);

    return user;
  }
}
