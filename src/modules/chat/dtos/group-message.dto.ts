import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto/base.dto';

export class GroupMessageDTO extends BaseDTO {
    @ApiProperty({
        name: 'groupId',
        description: 'Group message groupId',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly groupId: string;

    @ApiProperty({
        name: 'senderId',
        description: 'Group message senderId',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly senderId: string;

    @ApiProperty({
        name: 'content',
        description: 'Group message content',
        example: faker.lorem.paragraph(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly content: string;
}
