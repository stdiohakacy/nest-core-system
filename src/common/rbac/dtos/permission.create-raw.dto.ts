import { PartialType } from '@nestjs/swagger';
import { PermissionDTO } from './permission.dto';

export class PermissionCreateRawDTO extends PartialType(PermissionDTO) {}
