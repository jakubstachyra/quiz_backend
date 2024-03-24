import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Quiz } from './quiz.entity';
import { CreateQuizInput } from '../graphql/utils/createQuiz.input';
import { Question } from '../questions/question.entity';
import { Option } from '../options/option.entity';
import { query } from 'express';

@Injectable()
export class QuizService {
    constructor(
        @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
        private dataSource: DataSource
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
                            option.isCorrect = false; // 
                            const savedOption = await queryRunner.manager.save(option);
                            question.options.push(savedOption);
                        }
                        else {
                            const option = new Option();
                            option.text = optionData.text;
                            option.isCorrect = optionData.isCorrect !== undefined ? optionData.isCorrect : false; //Default false
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
}
