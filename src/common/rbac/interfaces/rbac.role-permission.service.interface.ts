import { DeleteResult } from 'typeorm';

export interface IRBACRolePermissionService {
    create(payload: { roleId: string; permissionId: string }): Promise<void>;
    deleteMany(find: Record<string, any>): Promise<DeleteResult>;
}
