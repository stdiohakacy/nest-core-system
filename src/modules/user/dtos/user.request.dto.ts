import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserRequestDTO {
    @IsNotEmpty()
    @IsUUID('4')
    @Type(() => String)
    user: string;
}
