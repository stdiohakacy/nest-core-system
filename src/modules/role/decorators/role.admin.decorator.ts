import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolePutToRequestGuard } from '../guards/role.put-to-request.guard';
import { RoleNotFoundGuard } from '../guards/role.not-found.guard';
import { RoleActiveGuard } from '../guards/role.active.guard';
import { ROLE_IS_ACTIVE_META_KEY } from '../constants/role.constant';

export function RoleAdminGetGuard(): MethodDecorator {
    return applyDecorators(UseGuards(RolePutToRequestGuard, RoleNotFoundGuard));
}

export function RoleAdminUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
        SetMetadata(ROLE_IS_ACTIVE_META_KEY, [true])
    );
}

export function RoleAdminDeleteGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
        SetMetadata(ROLE_IS_ACTIVE_META_KEY, [true])
    );
}

export function RoleAdminUpdateActiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
        SetMetadata(ROLE_IS_ACTIVE_META_KEY, [false])
    );
}

export function RoleAdminUpdateInactiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(RolePutToRequestGuard, RoleNotFoundGuard, RoleActiveGuard),
        SetMetadata(ROLE_IS_ACTIVE_META_KEY, [true])
    );
}
