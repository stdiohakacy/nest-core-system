import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ENUM_RBAC_ROLE_TYPE } from '../constants/rbac.enum.role.constant';
import {
    RBAC_PERMISSION_TYPE_META_KEY,
    RBAC_ROLE_TYPE_META_KEY,
} from '../constants/rbac.constant';
import { ENUM_RBAC_PERMISSION_TYPE } from '../constants/rbac.enum.permission.constant';
import { ENUM_RBAC_ROLE_STATUS_CODE_ERROR } from '../constants/rbac.role.status-code.constant';
import { ENUM_RBAC_PERMISSION_STATUS_CODE_ERROR } from '../constants/rbac.permission.status-code.constant';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

@Injectable()
export class RBACRolePermissionTypeAccessGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userRepo: UserRepository
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles: ENUM_RBAC_ROLE_TYPE[] =
            this.reflector.getAllAndOverride<ENUM_RBAC_ROLE_TYPE[]>(
                RBAC_ROLE_TYPE_META_KEY,
                [context.getHandler(), context.getClass()]
            );

        const requiredPermissions: ENUM_RBAC_PERMISSION_TYPE[] =
            this.reflector.getAllAndOverride<ENUM_RBAC_PERMISSION_TYPE[]>(
                RBAC_PERMISSION_TYPE_META_KEY,
                [context.getHandler(), context.getClass()]
            );
        const { user } = context.switchToHttp().getRequest();
        const userEntity = await this.userRepo.joinWithRBAC(user.id);

        const rolesName = userEntity.userRoles.map(
            (userRole) => userRole.role.name
        );

        const permissionsName = userEntity.userRoles
            .map((userRole) =>
                userRole.role.rolePermissions.map(
                    (rolePermission) => rolePermission.permission.name
                )
            )
            .flat();

        if (
            !requiredRoles ||
            rolesName.includes(ENUM_RBAC_ROLE_TYPE.SUPER_ADMIN)
        )
            return true;

        const isRoleValid = requiredRoles.every((requireRole) =>
            rolesName.includes(requireRole)
        );
        const isPermissionValid = requiredPermissions.every(
            (requirePermission) => permissionsName.includes(requirePermission)
        );

        if (!isRoleValid) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_RBAC_ROLE_STATUS_CODE_ERROR.ROLE_TYPE_INVALID_ERROR,
                message: 'role.error.typeForbidden',
            });
        }

        if (!isPermissionValid) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_RBAC_PERMISSION_STATUS_CODE_ERROR.PERMISSION_TYPE_INVALID_ERROR,
                message: 'permission.error.typeForbidden',
            });
        }

        return true;
    }
}
