import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Quiz } from '../quizzes/quiz.entity';
import { Question } from '../questions/question.entity';
import { Option } from '../options/option.entity';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QuizAttempt } from '../quiz-attempts/quiz-attempt.entity';
import { UserAnswer } from '../user-answers/user-answer.entity';
import { UserService } from '../users/users.service';
import { Users } from '../users/user.entity';

describe('QuizService', () => {
    let service: QuizService;
    let mockQuizRepository: any;

    beforeEach(async () => {
        mockQuizRepository = {
            findOne: jest.fn().mockImplementation(({ where: { id } }) => {
                if (id === 1) {
                    return Promise.resolve({
                        id: 1,
                        title: 'Sample Quiz',
                        questions: [
                            {
                                id: 1,
                                text: 'Sample Question',
                                type: 'CHOICE',
                                options: [
                                    { id: 1, text: 'Option 1', isCorrect: true },
                                    { id: 2, text: 'Option 2', isCorrect: false }
                                ]
                            }
                        ]
                    });
                }
                return null;
            })
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizService,
                UserService,
                {
                    provide: getRepositoryToken(Quiz),
                    useValue: mockQuizRepository
                },
                {
                    provide: getRepositoryToken(Question),
                    useValue: {}
                },
                {
                    provide: getRepositoryToken(Option),
                    useValue: {}
                },
                {
                    provide: getRepositoryToken(QuizAttempt),
                    useValue: {}
                },
                {
                    provide: getRepositoryToken(UserAnswer),
                    useValue: {}
                },
                {
                    provide: getRepositoryToken(Users),
                    useValue: {}
                },
                {
                    provide: DataSource,
                    useValue: {
                        createQueryRunner: jest.fn().mockReturnValue({
                            connect: jest.fn(),
                            startTransaction: jest.fn(),
                            commitTransaction: jest.fn(),
                            rollbackTransaction: jest.fn(),
                            release: jest.fn(),
                            manager: {
                                save: jest.fn(),
                                findOne: jest.fn(),

                            }
                        })
                    }
                }
            ],
        }).compile();

        service = module.get<QuizService>(QuizService);
    });

    it('should fetch a quiz with questions and options when quiz exists', async () => {
        const quizId = 1; // Assuming this quiz exists
        const result = await service.getQuizByID(quizId);

        expect(mockQuizRepository.findOne).toHaveBeenCalled();
        expect(result).toBeDefined();
        expect(result.id).toEqual(quizId);
        expect(result.title).toEqual('Sample Quiz');
        expect(result.questions).toHaveLength(1);
        expect(result.questions[0].options).toHaveLength(2);
    });

    it('should throw NotFoundException when quiz does not exist', async () => {
        const quizId = 99; // Assuming this quiz does not exist
        await expect(service.getQuizByID(quizId)).rejects.toThrow(NotFoundException);
    });


});
