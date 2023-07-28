import { PartialType } from '@nestjs/swagger';
import { RoleDTO } from './role.dto';

export class RoleCreateRawDTO extends PartialType(RoleDTO) {}
