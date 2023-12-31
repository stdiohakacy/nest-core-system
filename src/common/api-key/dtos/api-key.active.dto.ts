import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class ApiKeyActiveDTO {
    @ApiProperty({
        name: 'isActive',
        required: true,
        nullable: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;
}
