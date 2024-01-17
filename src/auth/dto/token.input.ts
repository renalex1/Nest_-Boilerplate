import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class TokenInput {
  @Field(() => String, { description: ' ' })
  token: string;
}
