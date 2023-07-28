import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import { UserPayloadSerialization } from '../../../modules/user/serializations/user.payload.serialization';
import { AuthJwtAccessGuard } from '../guards/jwt-access/auth.jwt-access.guard';
import { AuthJwtRefreshGuard } from '../guards/jwt-refresh/auth.jwt-refresh.guard';
import { ENUM_RBAC_ROLE_TYPE } from '../../../common/rbac/constants/rbac.enum.role.constant';
import { ENUM_RBAC_PERMISSION_TYPE } from '../../../common/rbac/constants/rbac.enum.permission.constant';
import { RBACRolePermissionTypeAccessGuard } from '../../../common/rbac/guards/rbac.role-permission-type.guard';
import {
    RBAC_PERMISSION_TYPE_META_KEY,
    RBAC_ROLE_TYPE_META_KEY,
} from '../../../common/rbac/constants/rbac.constant';

export const AuthJwtPayload = createParamDecorator(
    (data: string, ctx: ExecutionContext): Record<string, any> => {
        const { user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { user: UserPayloadSerialization }>();
        return data ? user[data] : user;
    }
);

export const AuthJwtToken = createParamDecorator(
    (data: string, ctx: ExecutionContext): string => {
        const { headers } = ctx.switchToHttp().getRequest<IRequestApp>();
        const { authorization } = headers;
        const authorizations: string[] = authorization.split(' ');

        return authorizations.length >= 2 ? authorizations[1] : undefined;
    }
);

export function AuthJwtAccessProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtAccessGuard));
}

export function AuthJwtRefreshProtected(): MethodDecorator {
    return applyDecorators(UseGuards(AuthJwtRefreshGuard));
}

export function AuthJwtRBACAccessProtected(policy: {
    roles?: ENUM_RBAC_ROLE_TYPE[];
    permissions?: ENUM_RBAC_PERMISSION_TYPE[];
}): MethodDecorator {
    return applyDecorators(
        UseGuards(AuthJwtAccessGuard, RBACRolePermissionTypeAccessGuard),
        SetMetadata(RBAC_ROLE_TYPE_META_KEY, policy?.roles),
        SetMetadata(RBAC_PERMISSION_TYPE_META_KEY, policy?.permissions)
    );
}
