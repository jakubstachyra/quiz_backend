import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AnswerInput {
    @Field(() => Int)
    questionId: number;

    @Field(() => [Int], {nullable:true})
    chosenOptionIds?: number[];

    @Field(() => Int, { nullable: true })
    chosenOptionId?: number;

    @Field({ nullable: true })
    textAnswer?: string;

    @Field(() => [Int], { nullable: true })
    chosenOrder?: [number];
}
