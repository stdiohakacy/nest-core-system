import { PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';

export class UserActiveDTO extends PickType(UserDTO, [
    'username',
    'activeKey',
]) {}
