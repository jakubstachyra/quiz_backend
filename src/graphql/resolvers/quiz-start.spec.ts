import { Test, TestingModule } from '@nestjs/testing';
import { QuizResolver } from './quiz.resolver';
import { QuizService } from '../../quizzes/quiz.service';

describe('QuizResolver', () => {
    let resolver: QuizResolver;
    let service: QuizService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizResolver,
                {
                    provide: QuizService,
                    useValue: {
                        startQuizById: jest.fn(),
                    },
                },
            ],
        }).compile();

        resolver = module.get<QuizResolver>(QuizResolver);
        service = module.get<QuizService>(QuizService);
    });

    it('should return a new quiz attempt id', async () => {
        const quizId = 1;
        const userId = 1;
        const expectedAttemptId = 10; // Mocked attempt ID

        jest.spyOn(service, 'startQuizById').mockResolvedValueOnce(expectedAttemptId);

        const result = await resolver.startQuizById(quizId, userId);
        expect(result).toEqual(expectedAttemptId);
        expect(service.startQuizById).toHaveBeenCalledWith(quizId, userId);
    });

    it('should throw an error if the quiz does not exist', async () => {
        const quizId = 99; // Non-existent quiz
        const userId = 1;
        const errorMessage = 'Quiz not found';

        jest.spyOn(service, 'startQuizById').mockRejectedValueOnce(new Error(errorMessage));

        await expect(resolver.startQuizById(quizId, userId)).rejects.toThrow(errorMessage);
    });

    it('should throw an error if the user does not exist', async () => {
        const quizId = 1;
        const userId = 99; // Non-existent user
        const errorMessage = 'User not found';

        jest.spyOn(service, 'startQuizById').mockRejectedValueOnce(new Error(errorMessage));

        await expect(resolver.startQuizById(quizId, userId)).rejects.toThrow(errorMessage);
    });
});
