import { Field, ObjectType, Int, registerEnumType  } from '@nestjs/graphql';
import {Option} from "src/options/option.entity";

export enum QuestionType {
    OPEN = 'open',
    CHOICE = 'choice',
    MULTIPLE_CHOICE = 'multiple_choice'
  }
  
registerEnumType(QuestionType, {
  name: 'QuestionType',
});

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
