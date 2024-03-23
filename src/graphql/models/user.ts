import { ObjectType, Field, Int, registerEnumType } from "@nestjs/graphql";

enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name?: string;

  @Field()
  email?: string;

  @Field(() => UserRole)
  role?: string;
}

