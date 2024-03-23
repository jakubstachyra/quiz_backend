import { Field, ObjectType, Int } from '@nestjs/graphql';
import {Option} from "src/options/option.entity";

enum QuestionType {
    OPEN = 'open',
    CHOICE = 'choice',
    MULTIPLE_CHOICE = 'multiple_choice'
  }
  
@ObjectType()
export class Question {
    @Field(() => Int)
    id: number;

    @Field()
    text: string;

    @Field(() => QuestionType)
    type: string;

    // nullable, because we can have open questions
    @Field(() => [Option], { nullable: true }) 
    options?: Option[];

    @Field({ nullable: true })
    expectedAnswer?: string; 
}

