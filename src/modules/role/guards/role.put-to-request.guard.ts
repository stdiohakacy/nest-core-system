import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from '@common/request/interfaces/request.interface';
import { RoleEntity } from '../entities/role.entity';
import { RoleService } from '../services/role.service';

@Injectable()
export class RolePutToRequestGuard implements CanActivate {
    constructor(private readonly roleService: RoleService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __role: RoleEntity }>();
        const { params } = request;
        const { role } = params;

        const check: RoleEntity = await this.roleService.findOneById(role);
        request.__role = check;

        return true;
    }
}
