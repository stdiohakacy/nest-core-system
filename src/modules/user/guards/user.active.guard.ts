import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '../entities/user.entity';
import { USER_ACTIVE_META_KEY } from '../constants/user.constant';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';

@Injectable()
export class UserActiveGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
            USER_ACTIVE_META_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!required) {
            return true;
        }

        const { __user } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserEntity }>();

        if (!required.includes(__user.isActive)) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_ACTIVE_ERROR,
                message: 'user.error.isActiveInvalid',
            });
        }
        return true;
    }
}
