import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from '@common/request/interfaces/request.interface';
import { USER_INACTIVE_PERMANENT_META_KEY } from '@modules/user/constants/user.constant';
import { ENUM_USER_STATUS_CODE_ERROR } from '@modules/user/constants/user.status-code.constant';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserInactivePermanentGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
            USER_INACTIVE_PERMANENT_META_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!required) {
            return true;
        }

        const { __user } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserEntity }>();

        if (!required.includes(__user.inactivePermanent)) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
                message: 'user.error.inactivePermanent',
            });
        }
        return true;
    }
}
