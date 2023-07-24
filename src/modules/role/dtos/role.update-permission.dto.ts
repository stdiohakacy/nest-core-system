import { OmitType } from '@nestjs/swagger';
import { RoleCreateDTO } from '@modules/role/dtos/role.create.dto';

export class RoleUpdatePermissionDTO extends OmitType(RoleCreateDTO, [
    'name',
] as const) {}
