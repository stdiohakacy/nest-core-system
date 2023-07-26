import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HelperArrayService } from '../../../../common/helper/services/helper.array.service';
import { ENUM_ROLE_TYPE } from '../../constants/role.enum.constant';
import { ROLE_TYPE_META_KEY } from '../../constants/role.constant';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../../constants/role.status-code.constant';

@Injectable()
export class RolePayloadTypeGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly helperArrayService: HelperArrayService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredFor: ENUM_ROLE_TYPE[] = this.reflector.getAllAndOverride<
            ENUM_ROLE_TYPE[]
        >(ROLE_TYPE_META_KEY, [context.getHandler(), context.getClass()]);

        const { user } = context.switchToHttp().getRequest();
        const { type } = user;

        if (!requiredFor || type === ENUM_ROLE_TYPE.SUPER_ADMIN) {
            return true;
        }

        const hasFor: boolean = this.helperArrayService.includes(
            requiredFor,
            type
        );

        if (!hasFor) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_ROLE_STATUS_CODE_ERROR.ROLE_PAYLOAD_TYPE_INVALID_ERROR,
                message: 'role.error.typeForbidden',
            });
        }
        return hasFor;
    }
}
