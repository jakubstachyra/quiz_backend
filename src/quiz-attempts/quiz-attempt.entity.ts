import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Quiz } from 'src/quizzes/quiz.entity';
import { Users } from 'src/users/user.entity';
import { UserAnswer } from 'src/user-answers/user-answer.entity';

@Entity()
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  //@ManyToOne(() => Quiz, quiz => quiz.quizAttempts)
  //quiz: Quiz;

  //@ManyToOne(() => User, user => user.quizAttempts)
  //user: User;

  @Column()
  score: number;

  @Column()
  total_questions: number;

  @Column()
  correct_answers: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => UserAnswer, userAnswer => userAnswer.quizAttempt)
  userAnswers: UserAnswer[];
}
