import { Resolver, Query, Args, Mutation, Int } from "@nestjs/graphql";
import { User } from "../models/user";
import { Inject } from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { CreateUserInput } from "../utils/createUserInput";

@Resolver()
export class UserResolver{

    constructor(@Inject(UserService) private userService: UserService) {}

    @Query((returns)=> [User])
    getUsers(){
        return this.userService.getUsers();
        
    }
    @Query((returns)=> User, {nullable: true})
    getUserById(@Args('id', {type: () => Int})id: number){
        return this.userService.getUserById(id);
    }   
    @Mutation((returns) => User)
    createUser(@Args('createUserData') createUserData: CreateUserInput){
        return this.userService.createUser(createUserData);
    }
    
}