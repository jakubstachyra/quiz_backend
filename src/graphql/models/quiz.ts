import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Quiz {
  @Field(() => Int)
  id: number;

  @Field()
  name?: string;

  @Field()
  email?: string;

  @Field()
  role?: string;
}

