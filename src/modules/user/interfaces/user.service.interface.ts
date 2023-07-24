import { IAuthPassword } from '@common/auth/interfaces/auth.interface';
import { AwsS3Serialization } from '@common/aws/serializations/aws.s3.serialization';
import { UserCreateDTO } from '@modules/user/dtos/user.create.dto';
import { UserImportDTO } from '@modules/user/dtos/user.import.dto';
import { UserUpdateNameDTO } from '@modules/user/dtos/user.update-name.dto';
import { UserUpdateUsernameDTO } from '@modules/user/dtos/user.update-username.dto';
import { UserPayloadSerialization } from '@modules/user/serializations/user.payload.serialization';
import { UserEntity } from '../entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserUpdateGoogleSSODTO } from '../dtos/user.update-google-sso.dto';
import { PaginationListDTO } from '@common/pagination/dtos/pagination.list.dto';

export interface IUserService {
    findAll(find?: Record<string, any>): Promise<UserEntity[]>;
    findOneById(id: string): Promise<UserEntity>;
    findOne(find: Record<string, any>): Promise<UserEntity>;
    findOneByUsername(username: string): Promise<UserEntity>;
    findOneByEmail(email: string): Promise<UserEntity>;
    findOneByMobileNumber(mobileNumber: string): Promise<UserEntity>;
    getTotal(find?: Record<string, any>): Promise<number>;
    create(
        { firstName, lastName, email, mobileNumber }: UserCreateDTO,
        { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword
    ): Promise<UserEntity>;
    existByEmail(email: string): Promise<boolean>;
    existByMobileNumber(mobileNumber: string): Promise<boolean>;
    existByUsername(username: string): Promise<boolean>;
    delete(id: string): Promise<DeleteResult>;
    updateName(
        user: UserEntity,
        { firstName, lastName }: UserUpdateNameDTO
    ): Promise<UpdateResult>;
    updateUsername(
        user: UserEntity,
        { username }: UserUpdateUsernameDTO
    ): Promise<UpdateResult>;
    updatePhoto(id: string, photo: AwsS3Serialization): Promise<UpdateResult>;
    active(user: UserEntity): Promise<UserEntity>;
    inactive(user: UserEntity): Promise<UserEntity>;
    inactivePermanent(user: UserEntity): Promise<UserEntity>;
    blocked(user: UserEntity): Promise<UserEntity>;
    unblocked(user: UserEntity): Promise<UserEntity>;
    maxPasswordAttempt(user: UserEntity): Promise<UserEntity>;
    increasePasswordAttempt(user: UserEntity): Promise<UserEntity>;
    resetPasswordAttempt(user: UserEntity): Promise<UserEntity>;
    updatePasswordExpired(
        user: UserEntity,
        passwordExpired: Date
    ): Promise<UserEntity>;
    createPhotoFilename(): Promise<Record<string, any>>;
    payloadSerialization(user: UserEntity): Promise<UserPayloadSerialization>;
    deleteMany(find: Record<string, any>): Promise<boolean>;
    import(
        data: UserImportDTO[],
        { passwordCreated, passwordHash, salt }: IAuthPassword
    ): Promise<boolean>;
    updateGoogleSSO(
        user: UserEntity,
        { accessToken, refreshToken }: UserUpdateGoogleSSODTO
    ): Promise<UpdateResult>;
    updatePassword(
        user: UserEntity,
        { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword
    ): Promise<UpdateResult>;

    findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ): Promise<[UserEntity[], number]>;
}
