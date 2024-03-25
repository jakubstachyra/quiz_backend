import { InputType, Field } from '@nestjs/graphql';
import { CreateOptionInput } from './createOption.input';
import { QuestionType } from '../models/question.model';

@InputType()
export class CreateQuestionInput {
    @Field()
    text: string;

    @Field(() => QuestionType )
    type: QuestionType; 

    @Field(() => [CreateOptionInput], { nullable: true })
    options?: CreateOptionInput[];

    @Field({ nullable: true })
    expectedAnswer?: string;
}
