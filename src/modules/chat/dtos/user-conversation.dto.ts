import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../common/base/dto/base.dto';

export class UserConversationDTO extends BaseDTO {
    @ApiProperty({
        name: 'userId',
        description: 'UserConversation user id',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly userId: string;

    @ApiProperty({
        name: 'conversationId',
        description: 'UserConversation conversation id',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly conversationId: string;

    @ApiProperty({
        name: 'name',
        description: 'UserConversation name',
        example: faker.person.fullName(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    name: string;

    @ApiProperty({
        name: 'name',
        description: 'UserConversation name',
        example: faker.lorem.sentences(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    lastMessage: string;

    @ApiProperty({
        name: 'lastTime',
        description: 'UserConversation last time',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    lastTime: Date;
}
