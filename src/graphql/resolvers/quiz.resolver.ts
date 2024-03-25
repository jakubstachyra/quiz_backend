import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { CreateQuizInput } from '../utils/createQuiz.input';
import { QuizService } from '../../quizzes/quiz.service';
import { Inject} from '@nestjs/common';
import { Quiz } from '../models/quiz.model';


@Resolver()
export class QuizResolver {
    constructor(@Inject(QuizService) private quizService: QuizService) {}
    
    @Mutation(returns => Quiz)
    createQuiz(@Args('createQuizData') createQuizData: CreateQuizInput) {
        return this.quizService.createQuiz(createQuizData);
    }
    @Query(returns => Quiz)
    async getQuizById(@Args('id',{type: () => Int})id: number): Promise<Quiz>
    {
        return this.quizService.getQuizByID(id);
    }
}
