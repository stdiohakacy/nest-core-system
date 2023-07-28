import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IRBACRolePermissionService } from '../interfaces/rbac.role-permission.service.interface';
import { RolePermissionEntity } from '../../../modules/rbac/entities/role-permissions.entity';

@Injectable()
export class RBACRolePermissionService implements IRBACRolePermissionService {
    constructor(
        @InjectRepository(RolePermissionEntity)
        private rolePermissionRepo: Repository<RolePermissionEntity>
    ) {}

    async create(payload: {
        roleId: string;
        permissionId: string;
    }): Promise<void> {
        await this.rolePermissionRepo.save(
            this.rolePermissionRepo.create(payload)
        );
    }
    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return await this.rolePermissionRepo.delete(find);
    }
}
