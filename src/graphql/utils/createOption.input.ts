import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOptionInput {
    @Field()
    text: string;

    @Field()
    isCorrect: boolean;
}
