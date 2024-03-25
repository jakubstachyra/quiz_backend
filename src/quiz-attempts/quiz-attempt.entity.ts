import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from 'typeorm';
import { Quiz } from '../quizzes/quiz.entity';
import { Users } from '../users/user.entity';
import { UserAnswer } from '../user-answers/user-answer.entity';

@Entity()
export class QuizAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quiz, quiz => quiz.attempts)
  quiz: Quiz;

  @ManyToOne(() => Users, user => user.attempts)
  user: Users;

  @Column()
  score: number;

  @Column()
  maxScore: number;

  @Column()
  total_questions: number;

  @OneToMany(() => UserAnswer, userAnswer => userAnswer.quizAttempt)
  userAnswers: UserAnswer[];
}
