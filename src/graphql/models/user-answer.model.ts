import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Question } from "./question.model";
import { Option } from "./option.model";
import { QuizAttempt } from "./quiz-attempt.model";

@ObjectType()
export class UserAnswer {
    @Field(() => Int)
    id: number;

    @Field(() => Question)
    question: Question;

    @Field(() => Option, { nullable: true })
    chosenOption: Option;

    @Field({ nullable: true })
    textAnswer: string;

    @Field(() => QuizAttempt)
    quizAttempt: QuizAttempt; 

    @Field(() => Int, { nullable: true }) 
    chosenOrder: number;
}
