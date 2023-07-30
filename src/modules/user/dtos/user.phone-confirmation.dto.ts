import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UserPhoneConfirmDTO extends PickType(UserDTO, [
    'mobileNumber',
    'id',
]) {
    @ApiProperty({
        name: 'verificationCode',
        description: 'User verification code',
        example: '466917',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Type(() => String)
    verificationCode: string;
}
