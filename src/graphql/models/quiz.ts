import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Quiz {
  @Field(() => Int)
  id: number;

  @Field({nullable: false})
  title: string;

  @Field()
  authorID: string;

  @Field()
  role?: string;

}

