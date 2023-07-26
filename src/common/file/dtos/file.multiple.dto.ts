import { ApiProperty } from '@nestjs/swagger';

export class FileMultipleDTO {
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    files: any[];
}
