import { Test, TestingModule } from '@nestjs/testing';
import { QuizResolver } from './quiz.resolver';
import { QuizService } from '../../quizzes/quiz.service';
import { CreateQuizInput } from '../utils/createQuiz.input';

describe('QuizResolver', () => {
    let resolver: QuizResolver;
    let quizService: QuizService;

    beforeEach(async () => {
        const mockQuizService = {
            createQuiz: jest.fn().mockImplementation((input: CreateQuizInput) => Promise.resolve({
                ...input,
                id: '1', // We assume that it always returns 1,
            })),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizResolver,
                { provide: QuizService, useValue: mockQuizService },
            ],
        }).compile();

        resolver = module.get<QuizResolver>(QuizResolver);
        quizService = module.get<QuizService>(QuizService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should call createQuiz method with correct parameters', async () => {
        const createQuizInput: CreateQuizInput = {
            title: 'Test Quiz',
            authorId: 1, 
            questions: [],
        };

        await resolver.createQuiz(createQuizInput);

        expect(quizService.createQuiz).toHaveBeenCalledTimes(1);
        expect(quizService.createQuiz).toHaveBeenCalledWith(createQuizInput);
    });
});
