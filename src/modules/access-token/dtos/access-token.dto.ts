import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/base/dto/base.dto';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { faker } from '@faker-js/faker';
import { Type } from 'class-transformer';

export class AccessTokenDTO extends BaseDTO {
    @ApiProperty({
        name: 'token',
        description: 'Access token',
        example: faker.string.alphanumeric(30),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    token: string;

    @ApiProperty({
        name: 'userId',
        description: 'Access token user id',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsUUID()
    @IsNotEmpty()
    @Type(() => String)
    userId: string;
}
