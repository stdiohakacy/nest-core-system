import { DeleteResult } from 'typeorm';
import { PermissionCreateRawDTO } from '../dtos/permission.create-raw.dto';
import { PermissionEntity } from '../../../modules/rbac/entities/permission.entity';

export interface IRBACPermissionService {
    createRaw({ name }: PermissionCreateRawDTO): Promise<PermissionEntity>;
    findOneByName(name: string): Promise<PermissionEntity>;
    deleteMany(find: Record<string, any>): Promise<DeleteResult>;
}
