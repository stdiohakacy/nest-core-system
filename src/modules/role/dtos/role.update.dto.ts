import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RoleUpdateDTO {
    @ApiProperty({
        description: 'Description of role',
        example: faker.lorem.sentence(),
        required: false,
        nullable: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    readonly description: string;
}
