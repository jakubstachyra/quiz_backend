// option.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Question } from 'src/questions/question.entity';

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, question => question.options)
  question: Question;

  @Column()
  text: string;

  @Column()
  is_correct: boolean;
}
