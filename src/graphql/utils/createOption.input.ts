import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateOptionInput {
    @Field()
    text: string;

    @Field(() => Int,{nullable: true})
    expectedOrder?: number
    @Field({nullable: true})
    isCorrect?: boolean;
}
