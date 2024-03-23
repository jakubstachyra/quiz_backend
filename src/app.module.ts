import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlModule } from './graphql/graphql.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {Question} from './questions/question.entity';
import {Option} from './options/option.entity';
import {Quiz} from './quizes/quiz.entity';
import {User} from'./users/user.entity';
import { UserAnswer } from './user-answers/user-answer.entity';
import { QuizAttempt } from './quiz-attempts/quiz-attempt.entity';

@Module({
  imports: [GraphqlModule,
  ConfigModule.forRoot({
    isGlobal: true,
}),
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (ConfigService: ConfigService) =>({
    type: 'postgres',
    host: ConfigService.get('DB_HOST'),
    port: ConfigService.get('DB_PORT'),
    username: ConfigService.get('DB_USERNAME'),
    password: ConfigService.get('DB_PASSWORD'),
    database: ConfigService.get('DB_DATABASE'),
    entities: [Question, Option, Quiz, User,UserAnswer, QuizAttempt ],
    synchronize: true, // in production we should use migrations
  }),
  inject: [ConfigService],  
  }),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
