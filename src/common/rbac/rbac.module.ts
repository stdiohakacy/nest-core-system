import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RBACRoleService } from './services/rbac.role.service';
import { RBACPermissionService } from './services/rbac.permission.service';
import { RBACUserRoleService } from './services/rbac.user-role.service';
import { RBACRolePermissionService } from './services/rbac.role-permission.service';
import { RoleEntity } from '../../modules/rbac/entities/role.entity';
import { UserRoleEntity } from '../../modules/rbac/entities/user-role.entity';
import { PermissionEntity } from '../../modules/rbac/entities/permission.entity';
import { RolePermissionEntity } from '../../modules/rbac/entities/role-permissions.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            RoleEntity,
            UserRoleEntity,
            PermissionEntity,
            RolePermissionEntity,
        ]),
    ],
    exports: [
        RBACRoleService,
        RBACPermissionService,
        RBACUserRoleService,
        RBACRolePermissionService,
    ],
    providers: [
        RBACRoleService,
        RBACPermissionService,
        RBACUserRoleService,
        RBACRolePermissionService,
    ],
    controllers: [],
})
export class RBACCommonModule {}
