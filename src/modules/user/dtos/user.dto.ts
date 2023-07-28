import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { IUserGoogleEntity } from '../interfaces/user.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BaseDTO } from '../../../common/base/dto/base.dto';
import { IsPasswordStrong } from '../../../common/request/validations/request.is-password-strong.validation';
import { MobileNumberAllowed } from '../../../common/request/validations/request.mobile-number-allowed.validation';
import { AwsS3Serialization } from '../../../common/aws/serializations/aws.s3.serialization';

export class UserDTO extends BaseDTO {
    @ApiProperty({
        name: 'username',
        description: 'User username',
        example: faker.internet.userName(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    username: string;

    @ApiProperty({
        name: 'firstName',
        description: 'User first name',
        example: faker.person.firstName(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    firstName: string;

    @ApiProperty({
        name: 'lastName',
        description: 'User last name',
        example: faker.person.lastName(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(30)
    @Type(() => String)
    lastName: string;

    @ApiProperty({
        name: 'email',
        description: 'User email',
        example: faker.internet.email(),
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    @Type(() => String)
    email: string;

    @ApiProperty({
        name: 'password',
        description: 'User password',
        example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string
            .alphanumeric(5)
            .toUpperCase()}@@!123`,
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsPasswordStrong()
    @MaxLength(50)
    password: string;

    @ApiProperty({
        name: 'passwordExpired',
        description: 'User password expired',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    passwordExpired: Date;

    @ApiProperty({
        name: 'passwordCreated',
        description: 'User password created',
        example: faker.date.recent(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    passwordCreated: Date;

    @ApiProperty({
        name: 'passwordAttempt',
        description: 'User password attempt',
        example: 0,
        required: true,
        nullable: false,
    })
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    passwordAttempt: number;

    @ApiProperty({
        name: 'signUpDate',
        description: 'User sign up date',
        example: 0,
        required: true,
        nullable: false,
    })
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    signUpDate: Date;

    @ApiProperty({
        name: 'signUpFrom',
        description: 'User sign up from',
        example: ENUM_USER_SIGN_UP_FROM.LOCAL,
        required: true,
        nullable: false,
    })
    @IsEnum(ENUM_USER_SIGN_UP_FROM)
    @IsString()
    @IsNotEmpty()
    signUpFrom: ENUM_USER_SIGN_UP_FROM;

    @ApiProperty({
        name: 'salt',
        description: 'User password salt',
        example: '',
        required: true,
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    salt: string;

    @ApiProperty({
        name: 'isActive',
        description: 'User is active',
        example: true,
        required: true,
        nullable: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;

    @ApiPropertyOptional({
        name: 'activeKey',
        description: 'User active key',
        example: faker.string.alphanumeric(30),
        required: false,
        nullable: true,
    })
    @IsString()
    @IsOptional()
    activeKey?: string;

    @ApiProperty({
        name: 'inactivePermanent',
        description: 'User inactive permanent',
        example: false,
        required: true,
        nullable: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    inactivePermanent: boolean;

    @ApiProperty({
        name: 'blocked',
        description: 'User blocked',
        example: false,
        required: true,
        nullable: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    blocked: boolean;

    @ApiPropertyOptional({
        name: 'mobileNumber',
        description: 'User mobile number',
        example: faker.phone.number('62812#########'),
        required: false,
        nullable: true,
    })
    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(14)
    @ValidateIf((e) => e.mobileNumber !== '')
    @Type(() => String)
    @MobileNumberAllowed()
    mobileNumber?: string;

    @ApiPropertyOptional({
        name: 'inactiveDate',
        description: 'User inactive date',
        example: faker.date.recent(),
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    inactiveDate?: Date;

    @ApiPropertyOptional({
        name: 'blockedDate',
        description: 'User blocked date',
        example: faker.date.recent(),
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    blockedDate?: Date;

    @ApiPropertyOptional({
        name: 'photo',
        description: 'User photo',
        example: faker.internet.avatar,
        required: false,
        nullable: true,
    })
    @IsOptional()
    @Type(() => AwsS3Serialization)
    photo?: AwsS3Serialization;

    @ApiPropertyOptional({
        name: 'google',
        description: 'User google',
        example: '',
        required: false,
        nullable: true,
    })
    @IsOptional()
    google?: IUserGoogleEntity;
}
