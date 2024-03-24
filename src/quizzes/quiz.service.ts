import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Quiz } from './quiz.entity';
import { CreateQuizInput } from 'src/graphql/utils/createQuiz.input';
import { Question } from 'src/questions/question.entity';
import { Option } from 'src/options/option.entity';

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
            const questions = []; // Utwórz tymczasową tablicę dla pytań

            for (const questionData of createQuizData.questions) {
                const question = new Question();
                question.text = questionData.text;
                question.type = questionData.type;
                question.expectedAnswer = questionData.expectedAnswer;
                
                question.options = []; // Utwórz tymczasową tablicę dla opcji

                // Upewnij się, że questionData.options jest tablicą przed iteracją
                if (Array.isArray(questionData.options)) {
                    for (const optionData of questionData.options) {
                        // Wewnątrz metody createQuiz lub podobnej

                if (questionData.type === 'sorting') {
                    const option = new Option();
                    option.text = optionData.text;
                    option.isCorrect = optionData.isCorrect;
                    option.expectedOrder = optionData.expectedOrder;
                      
                    const savedOption = await queryRunner.manager.save(option);
                    question.options.push(savedOption);
                }
                else{
                        const option = new Option();
                        option.text = optionData.text;
                        option.isCorrect = optionData.isCorrect;
                        const savedOption = await queryRunner.manager.save(option);
                        question.options.push(savedOption);
                    }
                }
            }
                
                // Zapisz pytanie (opcje powinny być zapisane kaskadowo jeśli są poprawnie skonfigurowane)
                const savedQuestion = await queryRunner.manager.save(question);
                questions.push(savedQuestion); // Dodaj zapisane pytanie do listy pytań quizu
            }

            quiz.questions = questions; // Przypisz pytania do quizu
            const newQuiz = await queryRunner.manager.save(quiz); // Zapisz cały quiz
            await queryRunner.commitTransaction();
            return newQuiz;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to create quiz: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }
}
