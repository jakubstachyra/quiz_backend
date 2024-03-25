import { Resolver, Query, Args, Mutation, Int } from "@nestjs/graphql";
import { Users } from "../models/user.model";
import { Inject } from "@nestjs/common";
import { UserService } from "../../users/users.service";
import { CreateUserInput } from "../utils/createUser.input";

@Resolver()
export class UserResolver{

    constructor(@Inject(UserService) private userService: UserService) {}

    @Query((returns)=> [Users])
    getUsers(){
        return this.userService.getUsers();
        
    }
    @Query((returns)=> Users, {nullable: true})
    getUserById(@Args('id', {type: () => Int})id: number){
        return this.userService.getUserById(id);
    }   
    @Mutation((returns) => Users)
    createUser(@Args('createUserData') createUserData: CreateUserInput){
        return this.userService.createUser(createUserData);
    }
    
}