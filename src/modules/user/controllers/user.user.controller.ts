import { Controller, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { UserUserDeleteSelfDoc } from '../docs/user.user.doc';
import { UserService } from '../services/user.service';
import { Response } from '../../../common/response/decorators/response.decorator';
import { GetUser, UserProtected } from '../decorators/user.decorator';

@ApiTags('modules.user.user')
@Controller({
    version: '1',
    path: '/user',
})
export class UserUserController {
    constructor(private readonly userService: UserService) {}

    @UserUserDeleteSelfDoc()
    @Response('user.deleteSelf')
    @UserProtected()
    @Delete('/delete')
    async deleteSelf(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.inactivePermanent(user);

        return;
    }
}
