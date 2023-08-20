import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDTO } from '../../../common/base/dto/base.dto';

export class PostDTO extends BaseDTO {
    @ApiProperty({
        name: 'title',
        description: 'Post title',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly title: string;

    @ApiProperty({
        name: 'content',
        description: 'Post content',
        example: faker.lorem.paragraph(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly content: string;
}
