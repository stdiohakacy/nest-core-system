import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import { IRequestApp } from '../../../../common/request/interfaces/request.interface';
import { UserService } from '../../services/user.service';

@Injectable()
export class UserPayloadPutToRequestGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserEntity }>();
        const { user } = request;

        const check: UserEntity = await this.userService.findOneById(user.id);
        request.__user = check;

        return true;
    }
}
