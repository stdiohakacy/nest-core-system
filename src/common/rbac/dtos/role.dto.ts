import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ENUM_RBAC_ROLE_TYPE } from '../constants/rbac.enum.role.constant';
import { BaseDTO } from '../../../common/base/dto/base.dto';

export class RoleDTO extends BaseDTO {
    @ApiProperty({
        example: ENUM_RBAC_ROLE_TYPE.USER,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    name: string;
}
