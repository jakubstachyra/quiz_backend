import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from 'src/quizzes/quiz.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Quiz } from 'src/quizzes/quiz.entity';
import { Repository } from 'typeorm';
import { CreateQuizInput } from 'src/graphql/utils/createQuiz.input';
import {QuestionType} from 'src/graphql/models/question.model';

describe('QuizService', () => {
    let service: QuizService;
    let mockQuizRepository: Partial<Repository<Quiz>>;

    beforeEach(async () => {
        mockQuizRepository = {
            save: jest.fn().mockImplementation(quiz => Promise.resolve({ ...quiz, id: Date.now() })),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizService,
                {
                    provide: getRepositoryToken(Quiz),
                    useValue: mockQuizRepository,
                },
            ],
        }).compile();

        service = module.get<QuizService>(QuizService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new quiz', async () => {
        const quizData: CreateQuizInput = {
            title: 'Test Quiz',
            authorId: 1,
            questions: [
                {
                    text: 'What is 2+2?',
                    type: QuestionType.CHOICE,
                    options: [
                        { text: '4', isCorrect: true, expectedOrder: null }, // Zakładamy, że opcje są wymagane dla pytań typu 'choice'
                        { text: '5', isCorrect: false, expectedOrder: null }
                    ],
                    expectedAnswer: null,
                    sequence: null
                }
                // Możesz dodać więcej pytań dla kompleksowej weryfikacji
            ],
            // Dodaj pozostałe wymagane pola, jeśli są
        };
        
        const result = await service.createQuiz(quizData);

        expect(result).toEqual(expect.any(Object));
        expect(result.title).toEqual(quizData.title);
        expect(result).toHaveProperty('id');
        expect(mockQuizRepository.save).toBeCalledWith(quizData);
    });

    // Tutaj możesz dodać więcej testów dotyczących różnych scenariuszy i przypadków brzegowych
});
