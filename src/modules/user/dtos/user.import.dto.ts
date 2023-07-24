import { OmitType } from '@nestjs/swagger';
import { UserCreateDTO } from './user.create.dto';

export class UserImportDTO extends OmitType(UserCreateDTO, [
    'password',
] as const) {}
