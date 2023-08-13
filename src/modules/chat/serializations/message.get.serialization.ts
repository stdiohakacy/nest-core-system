import { ApiProperty } from '@nestjs/swagger';
import { ResponseIdSerialization } from '../../../common/response/serializations/response.id.serialization';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { faker } from '@faker-js/faker';

export class MessageGetSerialization extends ResponseIdSerialization {
    @ApiProperty({
        name: 'content',
        description: 'Message content',
        example: 'Hello',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly content: string;

    @ApiProperty({
        name: 'fromUserId',
        description: 'Message from user id',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly fromUserId: string;

    @ApiProperty({
        name: 'conversationId',
        description: 'Message conversation id',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly conversationId: string;
}
