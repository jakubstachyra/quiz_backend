import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { QuizService } from './quiz.service';
import { QuizResolver } from '../graphql/resolvers/quiz.resolver';
import { QuizAttempt } from '../quiz-attempts/quiz-attempt.entity';
import { Question } from '../questions/question.entity'
import { UserAnswer } from '../user-answers/user-answer.entity';
import { UserService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import {Option} from "../options/option.entity"

@Module({
    imports: [TypeOrmModule.forFeature([Quiz, Question, QuizAttempt, UserAnswer, Option]),UsersModule],
    providers: [QuizResolver, QuizService],
})
export class QuizModule {}
