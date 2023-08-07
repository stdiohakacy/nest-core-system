import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDTO } from '../../../common/base/dto/base.dto';

export class CategoryDTO extends BaseDTO {
    @ApiProperty({
        name: 'name',
        description: 'Category name',
        example: 'Category 01',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly name: string;

    @ApiProperty({
        name: 'description',
        description: 'Category description',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly description: string;
}
