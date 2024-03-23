import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Quiz } from './quiz.entity';
import { CreateQuizInput } from 'src/graphql/utils/createQuiz.input';


@Injectable()
export class QuizService {
    constructor(private dataSource: DataSource, 
        @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>) {}

    async createQuiz(createQuizData: CreateQuizInput): Promise<Quiz> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{

            // TODO: Implement adding quiz to db. 
            
        } catch(error)
        {   
            await queryRunner.rollbackTransaction();
            console.error("Transaction failed:", error);
            throw new InternalServerErrorException("Failed to create quiz");
        } finally{
            queryRunner.release();
        }


        
        return 
    }
}
