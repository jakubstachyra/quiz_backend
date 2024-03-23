import { ObjectType, Field } from "@nestjs/graphql";
import { Int } from "@nestjs/graphql";

@ObjectType()
export class Option{
    @Field(() => Int)
    id: number;

    @Field()
    text: string;
    
    @Field()
    is_correct: boolean;
}