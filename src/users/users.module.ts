import { Module } from '@nestjs/common';
import { UserResolver } from 'src/graphql/resolvers/user.resolver';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [UserResolver, UserService],
    exports: [UserService],
})
export class UsersModule {

}
