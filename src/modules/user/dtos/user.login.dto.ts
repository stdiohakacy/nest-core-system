import { PickType } from '@nestjs/swagger';
import { UserCreateDTO } from './user.create.dto';

export class UserLoginDto extends PickType(UserCreateDTO, [
    'email',
    'password',
] as const) {}
