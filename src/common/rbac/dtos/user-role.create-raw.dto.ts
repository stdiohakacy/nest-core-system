import { PartialType } from '@nestjs/swagger';
import { UserRoleDTO } from './user-role.dto';

export class UserRoleCreateRawDTO extends PartialType(UserRoleDTO) {}
