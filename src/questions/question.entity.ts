// question.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Quiz } from 'src/quizzes/quizzes.entity';
import { Option } from 'src/options/option.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quiz, quiz => quiz.questions)
  quiz: Quiz;

  @Column()
  text: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Option, option => option.question)
  options: Option[];
}
