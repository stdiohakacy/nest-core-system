import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SMSSendDTO {
    @ApiProperty({
        name: 'phoneNumber',
        description: 'Sms phone number',
        example: ['+84921262052'],
        required: true,
        nullable: false,
    })
    @IsArray()
    @IsNotEmpty()
    readonly phoneNumber: string[];

    @ApiProperty({
        name: 'content',
        description: 'Sms content',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly content: string;
}
