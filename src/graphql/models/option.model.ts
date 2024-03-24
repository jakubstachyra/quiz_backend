import { ObjectType, Field } from "@nestjs/graphql";
import { Int } from "@nestjs/graphql";

@ObjectType()
export class Option{
    @Field(() => Int)
    id: number;

    @Field(()=> Int,{nullable:true})
    expectedOrder?: number;

    @Field()
    text: string;
    
    @Field()
    isCorrect: boolean;
}