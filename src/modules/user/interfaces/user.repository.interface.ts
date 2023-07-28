import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
    findOneByUsername(username: string): Promise<UserEntity>;
}
