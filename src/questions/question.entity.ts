import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Quiz } from '../quizzes/quiz.entity';
import { Option } from '../options/option.entity';
import { QuestionType } from '../graphql/models/question.model';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type:QuestionType;

  @Column()
  text: string;

  @Column({nullable: true})
  expectedAnswer?: string;

  @ManyToOne(() => Quiz, quiz => quiz.questions)
  quiz: Quiz;

  @OneToMany(() => Option, option => option.question)
  options?: Option[];
}
