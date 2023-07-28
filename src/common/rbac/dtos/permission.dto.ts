import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ENUM_RBAC_PERMISSION_TYPE } from '../constants/rbac.enum.permission.constant';
import { BaseDTO } from '../../../common/base/dto/base.dto';

export class PermissionDTO extends BaseDTO {
    @ApiProperty({
        example: ENUM_RBAC_PERMISSION_TYPE.USER_DELETE,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    name: string;
}
