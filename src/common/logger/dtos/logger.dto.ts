import { BaseDTO } from '@common/base/dto/base.dto';
import { ENUM_ROLE_TYPE } from '@modules/role/constants/role.enum.constant';
import {
    ENUM_LOGGER_ACTION,
    ENUM_LOGGER_LEVEL,
} from '../constants/logger.enum.constant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { ENUM_REQUEST_METHOD } from '@common/request/constants/request.enum.constant';
import { faker } from '@faker-js/faker';

export class LoggerDTO extends BaseDTO {
    @ApiProperty({
        name: 'level',
        description: 'Logger level',
        example: ENUM_LOGGER_LEVEL.DEBUG,
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_LOGGER_LEVEL)
    @IsString()
    level: ENUM_LOGGER_LEVEL;

    @ApiProperty({
        name: 'action',
        description: 'Logger action',
        example: ENUM_LOGGER_ACTION.TEST,
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_LOGGER_ACTION)
    @IsString()
    action: ENUM_LOGGER_ACTION;

    @ApiProperty({
        name: 'method',
        description: 'Logger method',
        example: ENUM_REQUEST_METHOD.GET,
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_REQUEST_METHOD)
    @IsString()
    method: ENUM_REQUEST_METHOD;

    @ApiProperty({
        name: 'anonymous',
        description: 'Logger anonymous',
        example: false,
        required: true,
        nullable: false,
    })
    @IsBoolean()
    anonymous: boolean;

    @ApiProperty({
        name: 'description',
        description: 'Logger description',
        example: 'Test description',
        required: true,
        nullable: false,
    })
    @IsString()
    description: string;

    @ApiProperty({
        name: 'tags',
        description: 'Logger tags',
        example: ['tag01', 'tag02'],
        required: true,
        nullable: false,
    })
    @IsArray()
    tags: string[];

    @ApiPropertyOptional({
        name: 'requestId',
        description: 'Logger requestId',
        example: faker.string.uuid(),
        required: false,
        nullable: true,
    })
    @IsUUID()
    @IsString()
    @IsOptional()
    requestId?: string;

    @ApiPropertyOptional({
        name: 'userId',
        description: 'Logger userId',
        example: faker.string.uuid(),
        required: false,
        nullable: true,
    })
    @IsUUID()
    @IsString()
    @IsOptional()
    userId?: string;
    // roleId?: string;

    @ApiPropertyOptional({
        name: 'apiKeyId',
        description: 'Logger apiKeyId',
        example: faker.string.uuid(),
        required: false,
        nullable: true,
    })
    @IsUUID()
    @IsString()
    @IsOptional()
    apiKeyId?: string;

    @ApiPropertyOptional({
        name: 'type',
        description: 'Logger type',
        example: ENUM_ROLE_TYPE.USER,
        required: false,
        nullable: true,
    })
    @IsEnum(ENUM_ROLE_TYPE)
    @IsString()
    @IsOptional()
    type?: ENUM_ROLE_TYPE;

    @ApiPropertyOptional({
        name: 'params',
        description: 'Logger params',
        example: { testParam: 'test value' },
        required: false,
        nullable: true,
    })
    @IsOptional()
    params?: Record<string, any>;

    @ApiPropertyOptional({
        name: 'bodies',
        description: 'Logger bodies',
        example: { testBody: 'test value' },
        required: false,
        nullable: true,
    })
    @IsOptional()
    bodies?: Record<string, any>;

    @ApiPropertyOptional({
        name: 'statusCode',
        description: 'Logger status code',
        example: 200,
        required: false,
        nullable: true,
    })
    @IsNumber()
    @IsOptional()
    statusCode?: number;

    @ApiPropertyOptional({
        name: 'path',
        description: 'Logger path',
        example: 'test/path',
        required: false,
        nullable: true,
    })
    @IsString()
    @IsOptional()
    path?: string;
}
