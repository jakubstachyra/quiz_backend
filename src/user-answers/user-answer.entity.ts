import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { QuizAttempt } from '../quiz-attempts/quiz-attempt.entity';
import { Question } from '../questions/question.entity';
import { Option } from '../options/option.entity';

@Entity()
export class UserAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question)
  question: Question;

  @ManyToOne(() => Option, { nullable: true })
  chosenOption: Option;
 
  @Column({ nullable: true })
  textAnswer: string;

  @ManyToOne(() => QuizAttempt, quizAttempt => quizAttempt.userAnswers)
  quizAttempt: QuizAttempt;

  @Column({ nullable: true })
  chosenOrder: number;
}
