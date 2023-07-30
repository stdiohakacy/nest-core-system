import { faker } from '@faker-js/faker';
import {
    ApiExcludeEndpoint,
    ApiHideProperty,
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
    IsString,
    IsNotEmpty,
    IsEmail,
    MaxLength,
    MinLength,
    IsUUID,
    IsOptional,
    ValidateIf,
    IsEnum,
} from 'class-validator';
import { IsPasswordStrong } from '../../../common/request/validations/request.is-password-strong.validation';
import { MobileNumberAllowed } from '../../../common/request/validations/request.mobile-number-allowed.validation';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { isString } from 'lodash';
export class UserCreateDTO {
    @ApiProperty({
        example: faker.internet.email(),
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    readonly email: string;

    @ApiProperty({
        example: faker.person.firstName(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    readonly firstName: string;

    @ApiProperty({
        example: faker.person.lastName(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    readonly lastName: string;

    @ApiPropertyOptional({
        example: faker.internet.userName(),
        required: true,
    })
    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    readonly username?: string;

    @ApiProperty({
        example: faker.phone.number('+84921262052'),
        required: true,
    })
    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(14)
    @ValidateIf((e) => e.mobileNumber !== '')
    @Type(() => String)
    // @MobileNumberAllowed()
    readonly mobileNumber?: string;

    @ApiHideProperty()
    @ApiPropertyOptional({
        name: 'activeKey',
        description: 'User active key',
        example: faker.string.alphanumeric(30),
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    readonly activeKey?: string;

    @ApiProperty({
        description: 'string password',
        example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string
            .alphanumeric(5)
            .toUpperCase()}@@!123`,
        required: true,
    })
    @IsNotEmpty()
    @IsPasswordStrong()
    @MaxLength(50)
    readonly password: string;

    @IsEnum(ENUM_USER_SIGN_UP_FROM)
    @IsString()
    @IsNotEmpty()
    readonly signUpFrom: ENUM_USER_SIGN_UP_FROM;
}
