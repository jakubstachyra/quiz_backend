import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { QuizAttempt } from 'src/quiz-attempts/quiz-attempt.entity';
import { Question } from 'src/questions/question.entity';
import { Option } from 'src/options/option.entity';

@Entity()
export class UserAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => QuizAttempt, quizAttempt => quizAttempt.userAnswers)
  quizAttempt: QuizAttempt;

  @ManyToOne(() => Question)
  question: Question;

  @ManyToOne(() => Option, { nullable: true })
  option: Option;

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  is_correct: boolean;
}
