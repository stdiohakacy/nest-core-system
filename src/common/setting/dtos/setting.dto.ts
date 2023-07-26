import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseDTO } from '../../base/dto/base.dto';
import { ENUM_SETTING_DATA_TYPE } from '../constants/setting.enum.constant';

export class SettingDTO extends BaseDTO {
    @ApiProperty({
        name: 'name',
        description: 'Setting name',
        example: 'Setting test name',
        required: true,
        nullable: false,
    })
    @IsString()
    name: string;

    @ApiPropertyOptional({
        name: 'description',
        description: 'Setting description',
        example: 'Setting test description',
        required: false,
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        name: 'type',
        description: 'Setting type',
        example: 'Setting test type',
        required: false,
        nullable: true,
    })
    @IsString()
    @IsEnum(ENUM_SETTING_DATA_TYPE)
    type: ENUM_SETTING_DATA_TYPE;

    @ApiProperty({
        name: 'value',
        description: 'Setting value',
        example: 'Setting test value',
        required: false,
        nullable: true,
    })
    @IsString()
    @IsString()
    value: string;
}
