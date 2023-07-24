import { BaseDTO } from 'src/common/base/dto/base.dto';
import { ENUM_ROLE_TYPE } from '../constants/role.enum.constant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsString,
    MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RoleDTO extends BaseDTO {
    @ApiProperty({
        name: 'name',
        description: 'Role name',
        example: 'admin',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    name: string;

    @ApiProperty({
        name: 'isActive',
        description: 'Role is active',
        example: true,
        required: true,
        nullable: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    @Type(() => Boolean)
    isActive: boolean;

    @ApiProperty({
        name: 'type',
        description: 'Role type',
        example: ENUM_ROLE_TYPE.ADMIN,
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_ROLE_TYPE)
    @IsString()
    @IsNotEmpty()
    type: ENUM_ROLE_TYPE;

    @ApiPropertyOptional({
        name: 'description',
        description: 'Role description',
        example: 'Role description',
        required: false,
        nullable: true,
    })
    @IsString()
    @IsNotEmpty()
    description?: string;
}
