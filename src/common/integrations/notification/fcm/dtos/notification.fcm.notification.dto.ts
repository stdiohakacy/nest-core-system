import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../../base/dto/base.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { faker } from '@faker-js/faker';

export class NotificationDTO extends BaseDTO {
    @ApiProperty({
        name: 'userId',
        description: 'Notification user id',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        name: 'title',
        description: 'Notification title',
        example: 'Title notification',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        name: 'body',
        description: 'Notification body',
        example: 'Body notification',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    body: string;
}
