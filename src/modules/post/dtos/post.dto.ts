import { ApiProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/base/dto/base.dto';
import { IsNotEmpty, IsOptional, IsString, isNotEmpty } from 'class-validator';
import { faker } from '@faker-js/faker';

export class PostDTO extends BaseDTO {
    @ApiProperty({
        name: 'title',
        description: 'Post title',
        example: 'New for today',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        name: 'action',
        description: 'Post content',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    content: string;
}
