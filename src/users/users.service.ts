import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserInput } from "src/graphql/utils/createUser.input";
import { Users } from "./user.entity";
import { DataSource, DeepPartial, Repository} from "typeorm";
import { UserRole } from "src/graphql/models/user.model";


@Injectable()
export class UserService{
    constructor(private dataSource: DataSource,@InjectRepository(Users) private usersRepo: Repository<Users> ) {}

    getUsers()
    {
        return this.usersRepo.find();
    }

    public getUserById(id: number){
        return this.usersRepo.findOneBy({id});
    }

    async createUser(createUserData: CreateUserInput): Promise<Users> {
        const queryRunner = this.dataSource.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            // Map CreateUserInput to Users type
            const userToBeCreated: DeepPartial<Users> = {
                name: createUserData.name,
                email: createUserData.email,
                role: createUserData.role as UserRole,
            };
    
            const newUser = queryRunner.manager.create(Users, userToBeCreated);
            
            const savedUser = await queryRunner.manager.save(Users, newUser);
            await queryRunner.commitTransaction();
            return savedUser;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error("Transaction failed:", error);
            throw new InternalServerErrorException("Failed to create user");
        }finally{
            await queryRunner.release();
        }
    }
    

}