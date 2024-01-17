import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class ConfirmUserInput extends PartialType(CreateUserInput) {
  @Field()
  email: string;

  @Field()
  confirmToken: string;
}
