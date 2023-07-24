import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from '@common/request/interfaces/request.interface';
import { RoleEntity } from '../entities/role.entity';
import { instanceToPlain } from 'class-transformer';

export const GetRole = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): any | RoleEntity => {
        const { __role } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __role: RoleEntity }>();
        return returnPlain ? instanceToPlain(__role) : __role;
    }
);
