import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @MinLength(3)
  @Field(() => String, { description: "A user's name" })
  name: string;

  @IsEmail()
  @Field(() => String, { description: "A user's  email" })
  email: string;

  @MinLength(3)
  @Field(() => String, { description: "A user's password" })
  password: string;
}
