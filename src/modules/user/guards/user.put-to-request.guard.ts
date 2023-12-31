import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserEntity }>();
        const { params } = request;
        const { user } = params;
        const check: UserEntity = await this.userService.findOneById(user);
        request.__user = check;

        return true;
    }
}
