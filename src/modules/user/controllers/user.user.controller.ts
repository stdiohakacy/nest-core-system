import { Controller, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtUserAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { Response } from 'src/common/response/decorators/response.decorator';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import { UserUserDeleteSelfDoc } from 'src/modules/user/docs/user.user.doc';
import { UserService } from 'src/modules/user/services/user.service';
import { UserEntity } from '../entities/user.entity';

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
    @AuthJwtUserAccessProtected()
    @Delete('/delete')
    async deleteSelf(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.inactivePermanent(user);

        return;
    }
}
