import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from '../questions/question.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, question => question.options)
  question: Question;

  @Column()
  text: string;

  @Column({nullable: true})
  expectedOrder?: number;

  @Column()
  isCorrect: boolean;
}
