import {
    Injectable,
    CanActivate,
    ExecutionContext,
    NotFoundException,
} from '@nestjs/common';
import { RoleEntity } from '../entities/role.entity';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../constants/role.status-code.constant';

@Injectable()
export class RoleNotFoundGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __role } = context
            .switchToHttp()
            .getRequest<IRequestApp & { __role: RoleEntity }>();

        if (!__role) {
            throw new NotFoundException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
                message: 'role.error.notFound',
            });
        }

        return true;
    }
}
