import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { QuizService } from './quiz.service';
import { QuizResolver } from 'src/graphql/resolvers/quizResolver';


@Module({
    imports: [TypeOrmModule.forFeature([Quiz])],
    providers: [QuizResolver, QuizService],
})
export class QuizModule {

}
