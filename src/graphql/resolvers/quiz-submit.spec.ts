import { Test, TestingModule } from '@nestjs/testing';
import { QuizResolver } from './quiz.resolver';
import { QuizService } from '../../quizzes/quiz.service';
import { QuizAttempt } from '../../quiz-attempts/quiz-attempt.entity';
import { AnswerInput } from '../../graphql/utils/answer.input';

describe('QuizResolver - submitAnswers', () => {
    let resolver: QuizResolver;
    let service: QuizService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizResolver,
                {
                    provide: QuizService,
                    useValue: {
                        submitAnswers: jest.fn(),
                    },
                },
            ],
        }).compile();

        resolver = module.get<QuizResolver>(QuizResolver);
        service = module.get<QuizService>(QuizService);
    });

    it('should return the updated quiz attempt after submitting answers', async () => {
        const attemptId = 1;
        const answers: AnswerInput[] = [
            { questionId: 1, chosenOptionId: 3 },
            { questionId: 2, textAnswer: 'Answer text' },
        ];
        const expectedAttempt = new QuizAttempt(); // Mocked QuizAttempt entity
        expectedAttempt.id = attemptId;
        expectedAttempt.score = 5; // Example score
        expectedAttempt.total_questions = answers.length;

        jest.spyOn(service, 'submitAnswers').mockResolvedValueOnce(expectedAttempt);

        const result = await resolver.submitAnswers(attemptId, answers);
        expect(result).toEqual(expectedAttempt);
        expect(service.submitAnswers).toHaveBeenCalledWith(attemptId, answers);
    });

    it('should throw an error if the attempt does not exist', async () => {
        const attemptId = 99; // Non-existent attempt ID
        const answers: AnswerInput[] = []; // Example answers array
        const errorMessage = 'Quiz attempt not found';

        jest.spyOn(service, 'submitAnswers').mockRejectedValueOnce(new Error(errorMessage));

        await expect(resolver.submitAnswers(attemptId, answers)).rejects.toThrow(errorMessage);
    });
});
