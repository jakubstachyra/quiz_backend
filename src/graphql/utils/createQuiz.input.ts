import { InputType, Field, Int } from '@nestjs/graphql';
import { CreateQuestionInput } from './createQuestion.input';

@InputType()
export class CreateQuizInput {
    @Field()
    title: string;

    @Field(() => Int)
    authorId: number;

    @Field(() => [CreateQuestionInput])
    questions: CreateQuestionInput[];
}
