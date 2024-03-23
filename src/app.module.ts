import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {Question} from './questions/question.entity';
import {Option} from './options/option.entity';
import {Quiz} from './quizzes/quizzes.entity';
import {Users} from'./users/user.entity';
import { UserAnswer } from './user-answers/user-answer.entity';
import { QuizAttempt } from './quiz-attempts/quiz-attempt.entity';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserResolver } from './graphql/resolvers/userResolver';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
    }),
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
    entities: [Question, Option, Quiz, Users, UserAnswer, QuizAttempt ],
    synchronize: true, // in production we should use migrations
  }),
  inject: [ConfigService],  
  }),
  UsersModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
