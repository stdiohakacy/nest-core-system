import { PickType } from '@nestjs/swagger';
import { UserCreateDTO } from 'src/modules/user/dtos/user.create.dto';

export class UserLoginDto extends PickType(UserCreateDTO, [
    'email',
    'password',
] as const) {}
