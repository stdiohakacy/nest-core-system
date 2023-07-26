import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RoleRequestDTO {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    role: string;
}
