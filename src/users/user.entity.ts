import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Quiz } from '../quizzes/quiz.entity';
import { QuizAttempt } from '../quiz-attempts/quiz-attempt.entity';
import {UserRole} from '../graphql/models/user.model';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: UserRole})
  role: UserRole;

  @OneToMany(() => Quiz, quiz => quiz.author, {nullable:true})
  quizzes?: Quiz[];

 @OneToMany(() => QuizAttempt, quizAttempt => quizAttempt.user, {nullable:true})
  attempts?: QuizAttempt[];
}