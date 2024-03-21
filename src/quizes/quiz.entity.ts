import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Question } from 'src/questions/question.entity';
import { QuizAttempt } from 'src/quiz-attempts/quiz-attempt.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, user => user.quizzes)
  author: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Question, question => question.quiz)
  questions: Question[];

  @OneToMany(() => QuizAttempt, quizAttempt => quizAttempt.quiz)
  quizAttempts: QuizAttempt[];
}
