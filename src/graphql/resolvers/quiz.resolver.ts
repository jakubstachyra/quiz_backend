import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { CreateQuizInput } from '../utils/createQuiz.input';
import { QuizService } from '../../quizzes/quiz.service';
import { Inject} from '@nestjs/common';
import { Quiz } from '../models/quiz.model';
import { AnswerInput } from '../utils/answer.input';
import { QuizAttempt } from '../models/quiz-attempt.model';



@Resolver(of => Quiz)
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
    @Mutation(returns => Int) 
    async startQuizById(@Args('quizId', { type: () => Int }) quizId: number, @Args('userId', { type: () => Int }) userId: number): Promise<number> {
        return this.quizService.startQuizById(quizId, userId);
    }
    

    @Mutation(returns => QuizAttempt)
    async submitAnswers(
        @Args('attemptId', { type: () => Int }) attemptId: number,
        @Args('answers', { type: () => [AnswerInput] }) answers: AnswerInput[]
    ): Promise<QuizAttempt> {
        return this.quizService.submitAnswers(attemptId, answers);
    }
    
}
