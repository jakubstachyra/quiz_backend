import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Quiz } from './quiz.entity';
import { CreateQuizInput } from '../graphql/utils/createQuiz.input';
import { Question } from '../questions/question.entity';
import { Option } from '../options/option.entity';
import { QuizAttempt } from '../quiz-attempts/quiz-attempt.entity';
import { AnswerInput } from '../graphql/utils/answer.input';
import { UserAnswer } from '../user-answers/user-answer.entity';
import { UserService } from '../users/users.service';
import { QuestionType } from '../graphql/models/question.model';
@Injectable()
export class QuizService {
    constructor(
        @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
        private dataSource: DataSource,@InjectRepository(QuizAttempt)
        private quizAttemptRepository: Repository<QuizAttempt>,
        @InjectRepository(Option)
        private optionRepository: Repository<Option>,
        private readonly userService: UserService
    ) {}
    async createQuiz(createQuizData: CreateQuizInput): Promise<Quiz> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const quiz = new Quiz();
            quiz.title = createQuizData.title;
            quiz.authorId = createQuizData.authorId;
            const questions = []; 

            for (const questionData of createQuizData.questions) {
                const question = new Question();
                question.text = questionData.text;
                question.type = questionData.type;
                question.expectedAnswer = questionData.expectedAnswer;
                
                question.options = []; 

                if (Array.isArray(questionData.options)) {
                    for (const optionData of questionData.options) {
                        
                        if (questionData.type === 'sorting') {
                            const option = new Option();
                            option.text = optionData.text;
                            option.expectedOrder = optionData.expectedOrder;
                            option.isCorrect = false; 
                            const savedOption = await queryRunner.manager.save(option);
                            question.options.push(savedOption);
                        }
                        else {
                            const option = new Option();
                            option.text = optionData.text;
                            option.isCorrect = optionData.isCorrect !== undefined ? optionData.isCorrect : false; 
                            const savedOption = await queryRunner.manager.save(option);
                            question.options.push(savedOption);
                        }
                        
                }
            }
                
                const savedQuestion = await queryRunner.manager.save(question);
                questions.push(savedQuestion); 
            }

            quiz.questions = questions;
            const newQuiz = await queryRunner.manager.save(quiz);
            await queryRunner.commitTransaction();
            return newQuiz;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to create quiz: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async getQuizByID(id: number): Promise<Quiz>
    {
        const quiz = await this.quizRepository.findOne({
            where: {id},
            relations: ['questions', 'questions.options'],
        });
        if(!quiz)
        {
            throw new NotFoundException('Quiz with ID ${id} not found');
        }
        // Blocking access to correct answers
        quiz.questions.forEach(question => {
            delete question.expectedAnswer;
            question.options.forEach(option => {
                delete option.isCorrect;
                delete option.expectedOrder;
            });
        });

        return quiz;
    }
    async submitAnswers(attemptId: number, answers: AnswerInput[]): Promise<QuizAttempt> {
        const attempt = await this.quizAttemptRepository.findOne({
            where: { id: attemptId },
            relations: ['quiz', 'user', 'userAnswers', 'quiz.questions', 'quiz.questions.options']
        });
    
        if (!attempt) throw new NotFoundException(`Attempt with ID ${attemptId} not found.`);
    
        let score = 0; // Make sure score starts at 0
        const questions = attempt.quiz.questions;
    
        attempt.userAnswers = []; // Reset userAnswers for this attempt
    
        for (const answerInput of answers) {
            const question = questions.find(q => q.id === answerInput.questionId);
            if (!question) {
                throw new NotFoundException(`Question with ID ${answerInput.questionId} not found.`);
            }
    
            const userAnswer = new UserAnswer();
            userAnswer.question = question;
            userAnswer.quizAttempt = attempt;
    
            if (question.type === QuestionType.SORTING) {
                if (!answerInput.chosenOrder || answerInput.chosenOrder.length !== question.options.length) {
                    throw new Error('Invalid answer order provided for sorting question.');
                }

                const correctOrder = question.options.sort((a, b) => a.expectedOrder - b.expectedOrder).map(opt => opt.id);
                const isOrderCorrect = answerInput.chosenOrder.every((id, index) => id === correctOrder[index]);
    
                if (isOrderCorrect) {
                    score++; 
                }
    
            } else if (question.type === QuestionType.OPEN) {
                const normalizedExpectedAnswer = question.expectedAnswer.trim().toLowerCase()
                                                .replace(/\s+/g, ' ').replace(/\n+/g, '')
                                                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
                const normalizedUserAnswer = answerInput.textAnswer.trim().toLowerCase()
                                            .replace(/\s+/g, ' ').replace(/\n+/g, '')
                                            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
            
                if (normalizedExpectedAnswer === normalizedUserAnswer) {
                    score++; 
                }
                userAnswer.textAnswer = answerInput.textAnswer; 
            }
            else if (question.type === QuestionType.MULTIPLE_CHOICE && answerInput.chosenOptionIds) {
                const allSelectedOptionsAreCorrect = answerInput.chosenOptionIds.every(id =>
                    question.options.some(option => option.id === id && option.isCorrect)
                );
                const allCorrectOptionsAreSelected = question.options.filter(option => option.isCorrect).every(option =>
                    answerInput.chosenOptionIds.includes(option.id)
                );
            
                if (allSelectedOptionsAreCorrect && allCorrectOptionsAreSelected) {
                    score++;
                }
            }
            else { 
                    const chosenOption = question.options.find(option => option.id === answerInput.chosenOptionId);
                    if (!chosenOption) {
                        throw new NotFoundException(`Option with ID ${answerInput.chosenOptionId} not found.`);
                    }
                    userAnswer.chosenOption = chosenOption;
                    if (chosenOption.isCorrect) {
                        score++; 
                    }
                } 
    
            attempt.userAnswers.push(userAnswer);
        }

        attempt.score = score;
        attempt.total_questions = questions.length;
    
        // Save the updated attempt with all the new user answers
        await this.quizAttemptRepository.save(attempt);
    
        return attempt;
    }
    
    
    async startQuizById(quizId: number, userId: number): Promise<number> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
        const quiz = await this.quizRepository.findOne({ where: { id: quizId },
        relations: ['author','questions', 'questions.options' ] });
    
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${quizId} not found.`);
        }
        
        // Fetch the user from the database
        const user = await this.userService.getUserById(userId);
        
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }
    
        const newAttempt = new QuizAttempt();
        newAttempt.quiz = quiz;
        newAttempt.user = user; 
        newAttempt.score = 0;
        newAttempt.maxScore =  quiz.questions.length;
        newAttempt.total_questions = quiz.questions.length;
    
        await queryRunner.manager.save(newAttempt);

        await queryRunner.commitTransaction();
    
        return newAttempt.id;
    }catch (err) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException('Failed to start quiz attempt');
    } finally {
        await queryRunner.release();
    }
    }
    
    
}
