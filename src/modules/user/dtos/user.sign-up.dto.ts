import { OmitType } from '@nestjs/swagger';
import { UserCreateDTO } from './user.create.dto';

export class UserSignUpDTO extends OmitType(UserCreateDTO, [
    'signUpFrom',
] as const) {}
