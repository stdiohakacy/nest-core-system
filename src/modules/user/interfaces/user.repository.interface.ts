import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
    findOneById(id: string): Promise<UserEntity>;
    findOneByUsername(username: string): Promise<UserEntity>;
    findOneByEmail(email: string): Promise<UserEntity>;
    joinWithRBAC(id: string): Promise<UserEntity>;
}
