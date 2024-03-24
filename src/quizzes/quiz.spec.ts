import { Test, TestingModule } from '@nestjs/testing';
import { QuizService } from './quiz.service';
import { DataSource, Repository } from 'typeorm';
import { Quiz } from '../quizzes/quiz.entity';
import { Question } from '../questions/question.entity';
import { Option } from '../options/option.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {QuestionType} from '../graphql/models/question.model';

describe('QuizService', () => {
    let service: QuizService;
    let dataSource: DataSource;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizService,
                {
                    provide: getRepositoryToken(Quiz),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(Question),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(Option),
                    useClass: Repository
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
                                save: jest.fn().mockImplementation(entity => Promise.resolve(entity))
                            }
                        })
                    }
                }
            ],
        }).compile();

        service = module.get<QuizService>(QuizService);
        dataSource = module.get<DataSource>(DataSource);
    });

    it('should create a new quiz with questions and options', async () => {
        const createQuizInput = {
            title: 'Test Quiz',
            authorId: 1,
            questions: [
                {
                    text: 'Test Question 1',
                    type: QuestionType.CHOICE,
                    options: [
                        { text: 'Option 1', isCorrect: true },
                        { text: 'Option 2', isCorrect: false }
                    ],
                },
                {
                    text: 'Test Question 2',
                    type: QuestionType.SORTING,
                    options: [
                        { text: 'Option A', expectedOrder: 1 },
                        { text: 'Option B', expectedOrder: 2 }
                    ],
                },
                {
                    text: 'Test Question 3',
                    type: QuestionType.MULTIPLE_CHOICE,
                    options: [
                        { text: 'Option A', isCorrect: true },
                        { text: 'Option B', isCorrect: true },
                        { text: 'Option C', isCorrect: false },
                    ],
                },
                {
                    text: 'Test Question 4',
                    type: QuestionType.OPEN,
                    options: [],
                }

            ]
        };
    
        const result = await service.createQuiz(createQuizInput);

        expect(result).toBeDefined();
        expect(result.title).toEqual(createQuizInput.title);
        expect(result.questions).toHaveLength(createQuizInput.questions.length);

        result.questions.forEach((question, index) => {
            const inputQuestion = createQuizInput.questions[index];
            expect(question.options).toHaveLength(inputQuestion.options.length);
            if ('expectedAnswer' in inputQuestion) {
                expect(question.expectedAnswer).toEqual(inputQuestion.expectedAnswer);
            }
            question.options.forEach((option, optionIndex) => {
                const inputOption = inputQuestion.options[optionIndex];
                expect(option.text).toEqual(inputOption.text);
                if ('expectedOrder' in inputOption) {
                    expect(option.expectedOrder).toEqual(inputOption.expectedOrder);
                }
                if ('isCorrect' in inputOption) {
                    expect(option.isCorrect).toEqual(inputOption.isCorrect);
                }
        });
        
    });
    });
    
});
