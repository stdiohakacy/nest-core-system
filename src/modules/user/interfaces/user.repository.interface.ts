import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
    createMany(users: any[]): Promise<void>;
    findOneByUsername(username: string): Promise<UserEntity>;
    findOneByEmail(email: string): Promise<UserEntity>;
    joinWithRBAC(id: string): Promise<UserEntity>;
}
