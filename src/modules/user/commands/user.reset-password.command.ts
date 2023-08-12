import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';
import { UserRepository } from '../repositories/user.repository';
import { HelperDateService } from '../../../common/helper/services/helper.date.service';
import { UserResetPasswordDTO } from '../dtos/user.reset-password.dto';
import { AuthService } from '../../../common/auth/services/auth.service';

export class UserResetPasswordCommand implements ICommand {
    constructor(public readonly payload: UserResetPasswordDTO) {}
}

@CommandHandler(UserResetPasswordCommand)
export class UserResetPasswordHandler
    implements ICommandHandler<UserResetPasswordCommand>
{
    constructor(
        private readonly userRepo: UserRepository,
        private readonly helperDateService: HelperDateService,
        private readonly authService: AuthService
    ) {}

    async execute({ payload }: UserResetPasswordCommand) {
        const { password, passwordConfirmation, username, forgotKey } = payload;
        if (password !== passwordConfirmation) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_CONFIRMATION_NOT_MATCH_ERROR,
                message: 'user.error.passwordConfirmationNotMatch',
            });
        }
        const user = await this.userRepo.findOneByUsername(username);
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }
        if (!user.isActive) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
                message: 'user.error.inactive',
            });
        }
        if (user.forgotKey !== forgotKey) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_FORGOT_KEY_INVALID_ERROR,
                message: 'user.error.forgotKeyInvalid',
            });
        }
        if (user.forgotExpire < this.helperDateService.create()) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_ACTIVE_KEY_INVALID_ERROR,
                message: 'user.error.forgotKeyInvalid',
            });
        }

        const { passwordHash, salt, passwordExpired, passwordCreated } =
            await this.authService.createPassword(password);

        user.resetPassword({
            password: passwordHash,
            salt,
            passwordExpired,
            passwordCreated,
        });

        await this.userRepo.update(user.id, user);
    }
}
