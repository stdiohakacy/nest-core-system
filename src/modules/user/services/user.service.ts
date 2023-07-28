import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { IUserService } from '../interfaces/user.service.interface';
import { HelperDateService } from '../../../common/helper/services/helper.date.service';
import { HelperStringService } from '../../../common/helper/services/helper.string.service';
import { UserCreateDTO } from '../dtos/user.create.dto';
import { IAuthPassword } from '../../../common/auth/interfaces/auth.interface';
import { UserUpdateNameDTO } from '../dtos/user.update-name.dto';
import { UserUpdateUsernameDTO } from '../dtos/user.update-username.dto';
import { UserUpdateGoogleSSODTO } from '../dtos/user.update-google-sso.dto';
import { AwsS3Serialization } from '../../../common/aws/serializations/aws.s3.serialization';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { UserImportDTO } from '../dtos/user.import.dto';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService implements IUserService {
    private readonly uploadPath: string;
    private readonly authMaxPasswordAttempt: number;

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly helperDateService: HelperDateService,
        private readonly helperStringService: HelperStringService,
        private readonly configService: ConfigService
    ) {
        this.uploadPath = this.configService.get<string>('user.uploadPath');
        this.authMaxPasswordAttempt = this.configService.get<number>(
            'auth.password.maxAttempt'
        );
    }

    async findAll(find?: Record<string, any>): Promise<UserEntity[]> {
        return await this.userRepo.find({ where: find });
        // return this.userRepository.findAll<IUserEntity>(find, {
        //     ...options,
        //     join: true,
        // });
    }

    async findOneById(id: string): Promise<UserEntity> {
        return await this.userRepo.findOneBy({ id });
    }

    async findOne(find: Record<string, any>): Promise<UserEntity> {
        return await this.userRepo.findOne({ where: find });
    }

    async findOneByUsername(username: string): Promise<UserEntity> {
        return await this.userRepo.findOneBy({ username });
    }

    async findOneByEmail(email: string): Promise<UserEntity> {
        return await this.userRepo.findOneBy({ email });
    }

    async findOneByMobileNumber(mobileNumber: string): Promise<UserEntity> {
        return await this.userRepo.findOneBy({ mobileNumber });
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return await this.userRepo.count(find);
    }

    async create(
        {
            firstName,
            lastName,
            email,
            mobileNumber,
            activeKey,
            username,
            // role,
            signUpFrom,
        }: UserCreateDTO,
        { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword
    ): Promise<UserEntity> {
        const user = this.userRepo.create({
            username,
            activeKey,
            activeExpire: this.helperDateService.forwardInDays(3),
            firstName,
            lastName,
            email,
            password: passwordHash,
            isActive: false,
            inactivePermanent: false,
            blocked: false,
            salt,
            passwordExpired,
            passwordCreated,
            signUpDate: this.helperDateService.create(),
            passwordAttempt: 0,
            mobileNumber,
            signUpFrom,
        });
        return await this.userRepo.save(user);
    }

    async existByEmail(email: string): Promise<boolean> {
        return await this.userRepo.exist({ where: { email } });
    }

    async existByMobileNumber(mobileNumber: string): Promise<boolean> {
        return await this.userRepo.exist({ where: { mobileNumber } });
    }

    async existByUsername(username: string): Promise<boolean> {
        return await this.userRepo.exist({ where: { username } });
    }

    async delete(id: string): Promise<DeleteResult> {
        return await this.userRepo.delete({ id });
    }

    async updateName(
        user: UserEntity,
        { firstName, lastName }: UserUpdateNameDTO
    ): Promise<UpdateResult> {
        return await this.userRepo.update(user.id, { firstName, lastName });
    }

    async updateUsername(
        user: UserEntity,
        { username }: UserUpdateUsernameDTO
    ): Promise<UpdateResult> {
        return await this.userRepo.update(user.id, { username });
    }

    async updateGoogleSSO(
        user: UserEntity,
        { accessToken, refreshToken }: UserUpdateGoogleSSODTO
    ): Promise<UpdateResult> {
        return await this.userRepo.update(user.id, {
            google: { accessToken, refreshToken },
        });
    }

    async updatePhoto(
        id: string,
        photo: AwsS3Serialization
    ): Promise<UpdateResult> {
        return await this.userRepo.update(id, { photo });
    }

    async updatePassword(
        user: UserEntity,
        { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword
    ): Promise<UpdateResult> {
        return await this.userRepo.update(user.id, {
            password: passwordHash,
            passwordExpired,
            passwordCreated,
            salt,
        });
    }

    async active(user: UserEntity): Promise<UserEntity> {
        user.isActive = true;
        return await this.userRepo.save(user);
    }

    async inactive(user: UserEntity): Promise<UserEntity> {
        user.isActive = false;
        user.inactiveDate = this.helperDateService.create();
        return await this.userRepo.save(user);
    }

    async inactivePermanent(user: UserEntity): Promise<UserEntity> {
        user.isActive = false;
        user.inactivePermanent = true;
        user.inactiveDate = this.helperDateService.create();
        return await this.userRepo.save(user);
    }

    async blocked(user: UserEntity): Promise<UserEntity> {
        user.blocked = true;
        user.blockedDate = this.helperDateService.create();
        return await this.userRepo.save(user);
    }

    async unblocked(user: UserEntity): Promise<UserEntity> {
        user.blocked = false;
        user.blockedDate = null;

        return await this.userRepo.save(user);
    }

    async maxPasswordAttempt(user: UserEntity): Promise<UserEntity> {
        user.passwordAttempt = this.authMaxPasswordAttempt;
        return await this.userRepo.save(user);
    }

    async increasePasswordAttempt(user: UserEntity): Promise<UserEntity> {
        user.passwordAttempt = ++user.passwordAttempt;
        return await this.userRepo.save(user);
    }

    async resetPasswordAttempt(user: UserEntity): Promise<UserEntity> {
        user.passwordAttempt = 0;
        return await this.userRepo.save(user);
    }

    async updatePasswordExpired(
        user: UserEntity,
        passwordExpired: Date
    ): Promise<UserEntity> {
        user.passwordExpired = passwordExpired;
        return await this.userRepo.save(user);
    }

    async createPhotoFilename(): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);

        return {
            path: this.uploadPath,
            filename: filename,
        };
    }

    async payloadSerialization(
        user: UserEntity
    ): Promise<UserPayloadSerialization> {
        return plainToInstance(UserPayloadSerialization, user);
    }

    async import(
        data: UserImportDTO[],
        { passwordCreated, passwordHash, salt }: IAuthPassword
    ): Promise<boolean> {
        const passwordExpired: Date = this.helperDateService.backwardInDays(1);
        const users: UserEntity[] = data.map(
            ({ email, firstName, lastName, mobileNumber, signUpFrom }) => {
                const user = this.userRepo.create({
                    firstName,
                    lastName,
                    email,
                    password: passwordHash,
                    isActive: true,
                    inactivePermanent: false,
                    blocked: false,
                    salt,
                    passwordExpired,
                    passwordCreated,
                    signUpDate: this.helperDateService.create(),
                    passwordAttempt: 0,
                    mobileNumber,
                    signUpFrom,
                });

                return user;
            }
        );

        try {
            await this.userRepo.save(users);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async deleteMany(find: Record<string, any>): Promise<boolean> {
        try {
            await this.userRepo.delete(find);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ): Promise<[UserEntity[], number]> {
        const { _limit, _offset, _order } = pagination;
        return await this.userRepo.findAndCount({
            where: find,
            take: _limit,
            skip: _offset,
            order: _order,
        });
    }
}
