import { ObjectType, Field, Int, registerEnumType } from "@nestjs/graphql";
import { QuizAttempt } from "./quiz-attempt.model";
import { Quiz } from "./quiz.model";

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class Users {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    email: string;
    

    @Field(() => UserRole)
    role: UserRole;

    @Field(() => [Quiz], {nullable: true})
    quizzes?: Quiz[];

    @Field(() => [QuizAttempt], { nullable: true })
    attempts?: QuizAttempt[];
}

