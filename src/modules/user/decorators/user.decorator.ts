import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { instanceToPlain } from 'class-transformer';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import { UserPayloadPutToRequestGuard } from '../guards/payload/user.payload.put-to-request.guard';
import { UserNotFoundGuard } from '../guards/user.not-found.guard';
import { UserBlockedGuard } from '../guards/user.blocked.guard';
import { UserInactivePermanentGuard } from '../guards/user.inactive-permanent.guard';
import { UserActiveGuard } from '../guards/user.active.guard';
import {
    USER_ACTIVE_META_KEY,
    USER_BLOCKED_META_KEY,
    USER_INACTIVE_PERMANENT_META_KEY,
} from '../constants/user.constant';
export const GetUser = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): any | UserEntity => {
        const { __user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserEntity }>();
        return returnPlain ? instanceToPlain(__user) : __user;
    }
);

export function UserProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(UserPayloadPutToRequestGuard, UserNotFoundGuard)
    );
}

export function UserAuthProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            UserBlockedGuard,
            UserInactivePermanentGuard,
            UserActiveGuard
        ),
        SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(USER_BLOCKED_META_KEY, [false]),
        SetMetadata(USER_ACTIVE_META_KEY, [true])
    );
}
