import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { Option } from './option.model';
import { UserAnswer } from './user-answer.model';
import { QuizAttempt } from './quiz-attempt.model';

export enum QuestionType {
    OPEN = 'open',
    CHOICE = 'choice',
    MULTIPLE_CHOICE = 'multiple_choice',
    SORTING = 'sorting'
}
  
registerEnumType(QuestionType, {
    name: 'QuestionType',
});

@ObjectType()
export class Question {
    @Field(() => Int)
    id: number;

    @Field()
    text: string;

    @Field(() => QuestionType)
    type: QuestionType;

    @Field(() => [Option], { nullable: true }) 
    options?: Option[];

    @Field(() => [UserAnswer], {nullable: true})
    userAnswers?: UserAnswer[];

    @Field(() => [QuizAttempt],{nullable: true})
    attempts?: QuizAttempt[];

    @Field({ nullable: true })
    expectedAnswer?: string; 
}
