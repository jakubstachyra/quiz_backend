import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Quiz } from 'src/quizzes/quiz.entity';
import { CreateQuizInput } from '../utils/createQuiz.input';
import { QuizService } from 'src/quizzes/quiz.service';


@Resolver(of => Quiz)
export class QuizResolver {
    constructor(private readonly quizService: QuizService) {}

    @Mutation(returns => Quiz)
    createQuiz(@Args('createQuizData') createQuizData: CreateQuizInput) {
        return this.quizService.createQuiz(createQuizData);
    }
}
