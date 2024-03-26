import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Quiz } from "./quiz.model";
import { Users } from "./user.model";
import { UserAnswer } from "./user-answer.model";

@ObjectType()
export class QuizAttempt {
    @Field(() => Int)
    id: number;

    @Field(() => Quiz)
    quiz: Quiz;

    @Field(() => Users)
    user: Users;

    @Field(() => [UserAnswer])
    userAnswers: UserAnswer[];

    @Field()
    score: number;

    @Field()
    maxScore: number;
}

