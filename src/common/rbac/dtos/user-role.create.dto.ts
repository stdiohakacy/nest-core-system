import { PickType } from '@nestjs/swagger';
import { UserRoleDTO } from './user-role.dto';

export class UserRoleCreateDTO extends PickType(UserRoleDTO, [
    'userId',
    'roleId',
]) {}
