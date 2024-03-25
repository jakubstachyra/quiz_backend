import { Test, TestingModule } from '@nestjs/testing';
import { QuizResolver } from './quiz.resolver';
import { QuizService } from '../../quizzes/quiz.service';
import { CreateQuizInput } from '../utils/createQuiz.input';

describe('QuizResolver', () => {
    let resolver: QuizResolver;
    let quizService: QuizService;

    beforeEach(async () => {
        const mockQuizService = {
            getQuizByID: jest.fn().mockImplementation((id: number) => Promise.resolve({
                id,
                title: 'Sample Quiz',
                questions: [], 
            })),
            createQuiz: jest.fn(), 
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

    it('should call getQuizById method with correct parameters', async () => {
        const quizId = 1;
        const result = await resolver.getQuizById(quizId);

        expect(quizService.getQuizByID).toHaveBeenCalledTimes(1);
        expect(quizService.getQuizByID).toHaveBeenCalledWith(quizId);
        expect(result).toBeDefined();
        expect(result.id).toEqual(quizId);
        expect(result.title).toEqual('Sample Quiz');
    });

});
