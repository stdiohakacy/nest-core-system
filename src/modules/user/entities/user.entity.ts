import { Column, Entity } from 'typeorm';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UserDTO } from '../dtos/user.dto';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { AwsS3Serialization } from '../../../common/aws/serializations/aws.s3.serialization';
import { IUserGoogleEntity } from '../interfaces/user.interface';

export interface IUserEntity extends IBaseEntity<UserDTO> {
    username?: string;
    firstName: string;
    lastName: string;
    mobileNumber?: string;
    email: string;
    password: string;
    passwordExpired: Date;
    passwordCreated: Date;
    passwordAttempt: number;
    signUpDate: Date;
    signUpFrom: ENUM_USER_SIGN_UP_FROM;
    salt: string;
    isActive: boolean;
    inactivePermanent: boolean;
    inactiveDate?: Date;
    blocked: boolean;
    blockedDate?: Date;
    photo?: AwsS3Serialization;
    google?: IUserGoogleEntity;
    // role: string;
}

@Entity({ name: 'users' })
@UseDTO(UserDTO)
export class UserEntity extends BaseEntity<UserDTO> implements IUserEntity {
    @Column({ name: 'username', nullable: true })
    username?: string;

    @Column({ name: 'firstName' })
    firstName: string;

    @Column({ name: 'lastName' })
    lastName: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'password' })
    password: string;

    @Column({ name: 'passwordExpired', type: 'timestamptz' })
    passwordExpired: Date;

    @Column({ name: 'passwordCreated', type: 'timestamptz' })
    passwordCreated: Date;

    @Column({ name: 'passwordAttempt' })
    passwordAttempt: number;

    @Column({ name: 'signUpDate', type: 'timestamptz' })
    signUpDate: Date;

    @Column({
        name: 'signUpFrom',
        enum: ENUM_USER_SIGN_UP_FROM,
        default: ENUM_USER_SIGN_UP_FROM.LOCAL,
    })
    signUpFrom: ENUM_USER_SIGN_UP_FROM;

    @Column({ name: 'salt' })
    salt: string;

    @Column({ name: 'isActive', default: true })
    isActive: boolean;

    @Column({ name: 'inactivePermanent' })
    inactivePermanent: boolean;

    @Column({ name: 'blocked' })
    blocked: boolean;

    @Column({ name: 'inactiveDate', type: 'timestamptz', nullable: true })
    inactiveDate?: Date;

    @Column({ name: 'blockedDate', type: 'timestamptz', nullable: true })
    blockedDate?: Date;

    @Column({ name: 'photo', nullable: true, type: 'jsonb' })
    photo?: AwsS3Serialization;

    @Column({ name: 'google', nullable: true, type: 'jsonb' })
    google?: IUserGoogleEntity;

    @Column({ name: 'mobileNumber', nullable: true })
    mobileNumber?: string;
}
