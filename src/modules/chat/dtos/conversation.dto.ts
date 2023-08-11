import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from '../../../common/base/dto/base.dto';

export class ConversationDTO extends BaseDTO {
    @ApiProperty({
        name: 'name',
        description: 'Conversation name',
        example: 'Mr Adam',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly name: string;

    @ApiProperty({
        name: 'lastMessage',
        description: 'Conversation last message',
        example: 'Thank you!',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly lastMessage: string;

    @ApiProperty({
        name: 'lastTime',
        description: 'Conversation last time',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    readonly lastTime: string;

    @ApiProperty({
        name: 'userId',
        description: 'Conversation user id',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly userId: string;
}
