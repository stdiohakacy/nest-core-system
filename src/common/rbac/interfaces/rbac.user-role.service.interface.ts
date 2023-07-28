import { DeleteResult, InsertResult } from 'typeorm';
import { UserRoleCreateRawDTO } from '../dtos/user-role.create-raw.dto';
import { UserRoleDTO } from '../dtos/user-role.dto';
import { UserRoleCreateDTO } from '../dtos/user-role.create.dto';
import { UserRoleEntity } from '../../../modules/rbac/entities/user-role.entity';

export interface IRBACUserRoleService {
    createRaw({
        userId,
        roleId,
    }: UserRoleCreateRawDTO): Promise<UserRoleEntity>;
    deleteMany(find: Record<string, any>): Promise<DeleteResult>;

    create(data: UserRoleDTO);

    createMany(payload: UserRoleCreateDTO[]): Promise<void>;
}
