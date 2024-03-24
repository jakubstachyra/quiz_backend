import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Users } from 'src/users/user.entity';
import { Question } from 'src/questions/question.entity';
import { QuizAttempt } from 'src/quiz-attempts/quiz-attempt.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  authorId: number;

  @ManyToOne(() => Users, user => user.quizzes)
  author: Users;

  @OneToMany(() => Question, question => question.quiz)
  questions: Question[];

  //@OneToMany(() => QuizAttempt, quizAttempt => quizAttempt.quiz)
  //quizAttempts: QuizAttempt[];
}
