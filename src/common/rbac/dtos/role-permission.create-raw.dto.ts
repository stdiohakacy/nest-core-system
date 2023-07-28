import { PartialType } from '@nestjs/swagger';
import { RolePermissionDTO } from './role-permission.dto';

export class RolePermissionCreateRawDTO extends PartialType(
    RolePermissionDTO
) {}
