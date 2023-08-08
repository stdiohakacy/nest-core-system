import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDTO } from '../../../common/base/dto/base.dto';

export class ProductDTO extends BaseDTO {
    @ApiProperty({
        name: 'name',
        description: 'Product name',
        example: 'Product 01',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly name: string;

    @ApiProperty({
        name: 'price',
        description: 'Product price',
        example: 12000,
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    readonly price: number;

    @ApiProperty({
        name: 'description',
        description: 'Product description',
        example: faker.lorem.sentence(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    readonly description: string;

    @ApiProperty({
        name: 'inStock',
        description: 'Product in stock',
        example: true,
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsBoolean()
    @Type(() => Boolean)
    readonly inStock: boolean;
}
