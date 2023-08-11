import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../modules/category/repositories/category.repository';
import { faker } from '@faker-js/faker';
import { UserRepository } from '../../modules/user/repositories/user.repository';
import { ENUM_USER_SIGN_UP_FROM } from '../../modules/user/constants/user.enum.constant';
import { AuthService } from '../../common/auth/services/auth.service';

@Injectable()
export class MigrationUserSeed {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly authService: AuthService
    ) {}

    @Command({ command: 'seed:user', describe: 'seeds users' })
    async seeds(): Promise<void> {
        const { passwordHash, passwordExpired, passwordCreated, salt } =
            await this.authService.createPassword('cdef3456@A');

        const createUser = () => ({
            username: faker.internet.userName(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            mobileNumber: faker.phone.number(),
            email: faker.internet.email(),
            password: passwordHash,
            passwordExpired: passwordExpired,
            passwordCreated: passwordCreated,
            passwordAttempt: 0,
            signUpDate: faker.date.recent(),
            signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
            salt,
            isActive: true,
            inactivePermanent: false,
            inactiveDate: faker.date.recent(),
            blocked: false,
            isPhoneConfirmation: true,
        });

        try {
            await this.userRepo.createMany([
                ...Array.from({ length: 20 }, createUser),
                ...[
                    {
                        username: 'admin',
                        firstName: 'Admin',
                        lastName: 'Admin',
                        mobileNumber: faker.phone.number(),
                        email: faker.internet.email(),
                        password: passwordHash,
                        passwordExpired: passwordExpired,
                        passwordCreated: passwordCreated,
                        passwordAttempt: 0,
                        signUpDate: faker.date.recent(),
                        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
                        salt,
                        isActive: true,
                        inactivePermanent: false,
                        inactiveDate: faker.date.recent(),
                        blocked: false,
                        isPhoneConfirmation: true,
                    },
                    {
                        username: 'user',
                        firstName: 'User',
                        lastName: 'Normal',
                        mobileNumber: faker.phone.number(),
                        email: faker.internet.email(),
                        password: passwordHash,
                        passwordExpired: passwordExpired,
                        passwordCreated: passwordCreated,
                        passwordAttempt: 0,
                        signUpDate: faker.date.recent(),
                        signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
                        salt,
                        isActive: true,
                        inactivePermanent: false,
                        inactiveDate: faker.date.recent(),
                        blocked: false,
                        isPhoneConfirmation: true,
                    },
                ],
            ]);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    @Command({ command: 'remove:user', describe: 'remove users' })
    async remove(): Promise<void> {
        try {
            await this.userRepo.truncate();
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
