import { ApiProperty } from '@nestjs/swagger';

export class FileSingleDTO {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
