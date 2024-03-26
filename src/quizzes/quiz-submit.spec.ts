import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuizAttempt } from '../quiz-attempts/quiz-attempt.entity';
import { Option } from '../options/option.entity';
import { DataSource } from 'typeorm';
import { AnswerInput } from '../graphql/utils/answer.input';
import { NotFoundException } from '@nestjs/common';
import { Quiz } from './quiz.entity';
import { Users } from '../users/user.entity';
import { UserService } from '../users/users.service';
import { QuestionType } from '../graphql/models/question.model'; 

describe('QuizService', () => {
    let service: QuizService;
    let mockQuizAttemptRepository: any;
    let mockOptionRepository: any;
    let mockDataSource: any;
    let mockQuizRepository: any;

    beforeEach(async () => {
        mockQuizRepository = {
            id: 1,
            questions: [
                { id: 5, type: QuestionType.CHOICE, options: [{ id: 12, isCorrect: true }] },
                { id: 6, type: QuestionType.OPEN, expectedAnswer: 'May the force be with you', options: [] },
                { id: 7, type: QuestionType.MULTIPLE_CHOICE, options: [
                    { id: 15, isCorrect: true },
                    { id: 17, isCorrect: true },
                    { id: 18, isCorrect: false }
                ]},
            ],
        };});
    beforeEach(async () => {
        mockQuizAttemptRepository = {
            findOne: jest.fn().mockImplementation(({ where: { id } }) => {
                if (id === 1) {
                    return Promise.resolve({
                        id: 1,
                        quiz: mockQuizRepository,
                        user: { id: 1 },
                        userAnswers: []
                    });
                }
                return null;
            }),
            save: jest.fn().mockImplementation(attempt => Promise.resolve(attempt)),
        };

        mockOptionRepository = {
            find: jest.fn().mockResolvedValue([
                { id: 12, isCorrect: true },
                { id: 15, isCorrect: true },
                { id: 17, isCorrect: true },
                { id: 18, isCorrect: false },
                { id: 19, expectedOrder: 1 },
                { id: 20, expectedOrder: 2 }
            ]),
        };

        mockDataSource = {
            createQueryRunner: jest.fn().mockReturnValue({
                connect: jest.fn(),
                startTransaction: jest.fn(),
                commitTransaction: jest.fn(),
                rollbackTransaction: jest.fn(),
                release: jest.fn(),
                manager: {
                    save: jest.fn(),
                }
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizService,
                UserService,
                {
                    provide: getRepositoryToken(QuizAttempt),
                    useValue: mockQuizAttemptRepository
                },
                {
                    provide: getRepositoryToken(Option),
                    useValue: mockOptionRepository
                },
                {
                    provide: getRepositoryToken(Quiz),
                    useValue: mockQuizRepository
                },
                {
                    provide: getRepositoryToken(Users),
                    useValue: {}
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource
                },
            ],
        }).compile();

        service = module.get<QuizService>(QuizService);
    });

    describe('submitAnswers', () => {
        it('should correctly calculate the score for a variety of questions', async () => {
            const attemptId = 1; 
            const answers: AnswerInput[] = [
                { questionId: 5, chosenOptionId: 12 },
                { questionId: 6, textAnswer: "May the fOrce bE with you" },
                { questionId: 7, chosenOptionIds: [15, 17, 18] },
            ];

            const result = await service.submitAnswers(attemptId, answers);

            expect(result).toBeDefined();
            expect(result.score).toEqual(2); 
            expect(result.userAnswers).toHaveLength(answers.length);
        });
    });
});
