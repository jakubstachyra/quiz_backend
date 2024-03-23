// question.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Quiz } from 'src/quizzes/quiz.entity';
import { Option } from 'src/options/option.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  text: string;

  @ManyToOne(() => Quiz, quiz => quiz.questions)
  quiz: Quiz;
  
  @OneToMany(() => Option, option => option.question)
  options: Option[];
}
