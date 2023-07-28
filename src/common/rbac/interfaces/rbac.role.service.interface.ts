import { DeleteResult } from 'typeorm';
import { RoleCreateRawDTO } from '../dtos/role.create-raw.dto';
import { RoleEntity } from '../../../modules/rbac/entities/role.entity';

export interface IRBACRoleService {
    createRaw({ name }: RoleCreateRawDTO): Promise<RoleEntity>;
    findOneByName(name: string): Promise<RoleEntity>;
    findOneById(id: string): Promise<RoleEntity>;
    deleteMany(find: Record<string, any>): Promise<DeleteResult>;
}
