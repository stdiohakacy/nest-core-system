import { PickType } from '@nestjs/swagger';
import { UserCreateDTO } from './user.create.dto';

export class UserUpdateNameDTO extends PickType(UserCreateDTO, [
    'firstName',
    'lastName',
] as const) {}
