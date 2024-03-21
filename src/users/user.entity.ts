import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Quiz } from 'src/quizes/quiz.entity';
import { QuizAttempt } from 'src/quiz-attempts/quiz-attempt.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Quiz, quiz => quiz.author)
  quizzes: Quiz[];

  @OneToMany(() => QuizAttempt, quizAttempt => quizAttempt.user)
  quizAttempts: QuizAttempt[];
}
