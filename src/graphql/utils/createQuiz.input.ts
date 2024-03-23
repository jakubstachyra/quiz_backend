import { InputType, Field } from '@nestjs/graphql';
import { CreateQuestionInput } from './createQuestion.input';

@InputType()
export class CreateQuizInput {
    @Field()
    title: string;

    @Field(() => [CreateQuestionInput])
    questions: CreateQuestionInput[];
}
