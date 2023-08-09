import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto/base.dto';

export class DirectMessageDTO extends BaseDTO {
    @ApiProperty({
        name: 'senderId',
        description: 'Direct message senderId',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly senderId: string;

    @ApiProperty({
        name: 'receiverId',
        description: 'Direct message receiverId',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly receiverId: string;

    @ApiProperty({
        name: 'content',
        description: 'Direct message content',
        example: faker.lorem.paragraph(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly content: string;
}
