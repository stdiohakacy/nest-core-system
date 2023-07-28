import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
import { faker } from '@faker-js/faker';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { IsPasswordStrong } from 'src/common/request/validations/request.is-password-strong.validation';

export class UserResetPasswordDTO extends PickType(UserDTO, [
    'username',
    'password',
    'forgotKey',
]) {
    @ApiProperty({
        name: 'passwordConfirmation',
        description: 'User password confirmation',
        example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string
            .alphanumeric(5)
            .toUpperCase()}@@!123`,
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsPasswordStrong()
    @MaxLength(50)
    passwordConfirmation: string;
}
