import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../modules/category/repositories/category.repository';
import { faker } from '@faker-js/faker';
import { UserRepository } from '../../modules/user/repositories/user.repository';
import { ENUM_USER_SIGN_UP_FROM } from '../../modules/user/constants/user.enum.constant';
import { AuthService } from '../../common/auth/services/auth.service';
import { UserEntity } from '../../modules/user/entities/user.entity';

@Injectable()
export class MigrationUserSeed {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly authService: AuthService
    ) {}

    private createUser(
        username: string,
        firstName: string,
        lastName: string,
        mobileNumber: string,
        email: string,
        passwordHash: string,
        passwordExpired: Date,
        passwordCreated: Date
    ): UserEntity {
        const user = new UserEntity();

        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.mobileNumber = mobileNumber;
        user.email = email;
        user.password = passwordHash;
        user.passwordExpired = passwordExpired;
        user.passwordCreated = passwordCreated;
        user.passwordAttempt = 0;
        user.signUpDate = faker.date.recent();
        user.signUpFrom = ENUM_USER_SIGN_UP_FROM.LOCAL;
        user.isActive = true;
        user.inactivePermanent = false;
        user.inactiveDate = faker.date.recent();
        user.blocked = false;
        user.isPhoneConfirmation = true;

        return user;
    }

    @Command({ command: 'seed:user', describe: 'seeds users' })
    async seeds(): Promise<void> {
        const { passwordHash, passwordExpired, passwordCreated, salt } =
            await this.authService.createPassword('cdef3456@A');

        const user = this.createUser(
            'user',
            'User',
            'Normal',
            faker.phone.number(),
            faker.internet.email(),
            passwordHash,
            passwordExpired,
            passwordCreated
        );

        const admin = this.createUser(
            'admin',
            'Admin',
            'Normal',
            faker.phone.number(),
            faker.internet.email(),
            passwordHash,
            passwordExpired,
            passwordCreated
        );

        const users = Array.from({ length: 20 }).map(() => {
            const user = this.createUser(
                faker.internet.userName(),
                faker.person.lastName(),
                faker.person.firstName(),
                faker.phone.number(),
                faker.internet.email(),
                passwordHash,
                passwordExpired,
                passwordCreated
            );

            return user;
        });
        await this.userRepo.createMultiple([...users, ...[user, admin]]);
    }

    @Command({ command: 'remove:user', describe: 'remove users' })
    async remove(): Promise<void> {
        try {
            const userIds = (await this.userRepo.findAll()).map(
                (user) => user.id
            );
            await this.userRepo.deleteMultiple(userIds);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
