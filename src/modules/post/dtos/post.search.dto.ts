import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PostSearchDTO {
    @ApiProperty({
        name: 'text',
        description: 'Post text',
        example: 'text',
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsString()
    text: string;
}
