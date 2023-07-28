import { PickType } from '@nestjs/swagger';
import { UserCreateDTO } from './user.create.dto';

export class UserLoginDTO extends PickType(UserCreateDTO, [
    'username',
    'password',
] as const) {}
