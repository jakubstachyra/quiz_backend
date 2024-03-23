import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserInput } from "src/graphql/utils/createUserInput";
import { Users } from "./user.entity";
import { DataSource, Repository, Transaction } from "typeorm";
import { query } from "express";


@Injectable()
export class UserService{
    constructor(private dataSource: DataSource,@InjectRepository(Users) private usersRepo: Repository<Users> ) {}

    getUsers()
    {
        return this.usersRepo.find();
    }

    getUserById(id: number){
        return this.usersRepo.findOneBy({id});
    }

// userService.ts
async createUser(createUserData: CreateUserInput): Promise<Users> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
        // Tworzenie nowego użytkownika z danymi wejściowymi
        const newUser = queryRunner.manager.create(Users, createUserData);
        // Zapisanie nowego użytkownika
        const savedUser = await queryRunner.manager.save(newUser);
        await queryRunner.commitTransaction();
        return savedUser; // Zwraca zapisanego użytkownika
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("Transaction failed:", error);
        throw new InternalServerErrorException("Failed to create user");
    }
    finally{
        await queryRunner.release();
    }
}

}