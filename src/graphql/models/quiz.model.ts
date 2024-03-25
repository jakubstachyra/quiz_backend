import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Question } from './question.model';
import { Users } from './user.model';
import { QuizAttempt } from './quiz-attempt.model';

@ObjectType()
export class Quiz {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field(() => [Question])
    questions: Question[];

    @Field(() => Int)
    authorId: number;
    
    @Field(()=> Users)
    author: Users;

    @Field(() => [QuizAttempt])
    attempts?: QuizAttempt[];
}
