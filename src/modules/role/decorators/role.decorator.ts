import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RoleEntity } from '../entities/role.entity';
import { instanceToPlain } from 'class-transformer';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';

export const GetRole = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): any | RoleEntity => {
        const { __role } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __role: RoleEntity }>();
        return returnPlain ? instanceToPlain(__role) : __role;
    }
);
