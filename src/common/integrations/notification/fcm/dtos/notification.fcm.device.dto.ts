import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../../base/dto/base.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ENUM_DEVICE_TYPE } from '../constants/notification.device.enum.constant';
import { faker } from '@faker-js/faker';

export class DeviceDTO extends BaseDTO {
    @ApiProperty({
        name: 'type',
        description: 'Device type',
        example: ENUM_DEVICE_TYPE.WEB,
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_DEVICE_TYPE)
    @IsString()
    @IsNotEmpty()
    type: ENUM_DEVICE_TYPE;

    @ApiProperty({
        name: 'token',
        description: 'Device token',
        example: faker.string.alphanumeric(30),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    token: string;
}
