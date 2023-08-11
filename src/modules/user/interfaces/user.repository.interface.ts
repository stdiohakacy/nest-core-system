import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
    findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ): Promise<[UserEntity[], number]>;
    createMany(users: any[]): Promise<void>;
    findOneByUsername(username: string): Promise<UserEntity>;
    findOneByEmail(email: string): Promise<UserEntity>;
    joinWithRBAC(id: string): Promise<UserEntity>;
}
