import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    deletedAt: Date;

    @ApiProperty()
    createdBy: string;

    @ApiProperty()
    updatedBy: string;

    @ApiProperty()
    deletedBy: string;
}
