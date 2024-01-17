import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { ConfirmUserInput } from './dto/confirm-user.input';
import { LoginUserInput } from './dto/login-user.input';
import Ctx from 'src/types/context.typ';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async registerUser(@Args('input') input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Mutation(() => User)
  async confirmUser(@Args('input') input: ConfirmUserInput) {
    return this.userService.confirmUser(input);
  }

  @Query(() => User, { nullable: true })
  async loginUser(
    @Args('input') input: LoginUserInput,
    @Context() context: Ctx,
  ) {
    return this.userService.login(input, context);
  }

  @Query(() => User, { nullable: true })
  async me(@Context() context: Ctx) {
    return context.req.user;
  }

  @Query(() => User, { nullable: true })
  async logout(@Context() context: Ctx) {
    // return context.req.user;
    return this.userService.logout(context);
  }
}
