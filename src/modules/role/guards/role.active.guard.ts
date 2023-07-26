import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEntity } from '../entities/role.entity';
import { ROLE_IS_ACTIVE_META_KEY } from '../constants/role.constant';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../constants/role.status-code.constant';

@Injectable()
export class RoleActiveGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
            ROLE_IS_ACTIVE_META_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!required) {
            return true;
        }

        const { __role } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __role: RoleEntity }>();

        if (!required.includes(__role.isActive)) {
            throw new BadRequestException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_IS_ACTIVE_ERROR,
                message: 'role.error.isActiveInvalid',
            });
        }
        return true;
    }
}
