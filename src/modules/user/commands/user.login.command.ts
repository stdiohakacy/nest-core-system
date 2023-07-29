import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import {
    ENUM_USER_STATUS_CODE_ERROR,
    ENUM_USER_STATUS_CODE_SUCCESS,
} from '../constants/user.status-code.constant';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { UserLoginDTO } from '../dtos/user.login.dto';
import { SettingService } from '../../../common/setting/services/setting.service';
import { AuthService } from '../../../common/auth/services/auth.service';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { ENUM_AUTH_LOGIN_WITH } from '../../../common/auth/constants/auth.enum.constant';
import { AccessTokenEntity } from '../../../modules/access-token/entities/access-token.entity';
import { AccessTokenRepository } from '../../../modules/access-token/repositories/access-token.repository';
import { instanceToPlain } from 'class-transformer';
import { NotificationFCMDeviceRepository } from '../../../common/integrations/notification/fcm/repositories/notification.fcm.device.repository';
import { DeviceEntity } from '../../../modules/notification/entities/device.entity';
import { FCMService } from '../../../common/integrations/notification/fcm/services/notification.fcm.service';

export class UserLoginCommand implements ICommand {
    constructor(public readonly payload: UserLoginDTO) {}
}

@CommandHandler(UserLoginCommand)
export class UserLoginHandler implements ICommandHandler<UserLoginCommand> {
    constructor(
        private readonly settingService: SettingService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly accessTokenRepo: AccessTokenRepository,
        private readonly fcmService: FCMService
    ) {}
    async execute({ payload }: UserLoginCommand) {
        const { username, password } = payload;
        const user: UserEntity = await this.userService.findOneByUsername(
            username
        );
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        const passwordAttempt: boolean =
            await this.settingService.getPasswordAttempt();
        const maxPasswordAttempt: number =
            await this.settingService.getMaxPasswordAttempt();
        if (passwordAttempt && user.passwordAttempt >= maxPasswordAttempt) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_ATTEMPT_MAX_ERROR,
                message: 'user.error.passwordAttemptMax',
            });
        }

        const validate: boolean = await this.authService.validateUser(
            password,
            user.password
        );
        if (!validate) {
            await this.userService.increasePasswordAttempt(user);

            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
                message: 'user.error.passwordNotMatch',
            });
        } else if (user.blocked) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_BLOCKED_ERROR,
                message: 'user.error.blocked',
            });
        } else if (user.inactivePermanent) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_PERMANENT_ERROR,
                message: 'user.error.inactivePermanent',
            });
        } else if (!user.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
                message: 'user.error.inactive',
            });
        }

        await this.userService.resetPasswordAttempt(user);

        const userPayload: UserPayloadSerialization =
            await this.userService.payloadSerialization(user);
        const tokenType: string = await this.authService.getTokenType();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const payloadAccessToken: Record<string, any> =
            await this.authService.createPayloadAccessToken(userPayload);
        const payloadRefreshToken: Record<string, any> =
            await this.authService.createPayloadRefreshToken(userPayload.id, {
                loginWith: ENUM_AUTH_LOGIN_WITH.LOCAL,
            });

        const payloadEncryption = await this.authService.getPayloadEncryption();
        let payloadHashedAccessToken: Record<string, any> | string =
            payloadAccessToken;
        let payloadHashedRefreshToken: Record<string, any> | string =
            payloadRefreshToken;

        if (payloadEncryption) {
            payloadHashedAccessToken =
                await this.authService.encryptAccessToken(payloadAccessToken);
            payloadHashedRefreshToken =
                await this.authService.encryptRefreshToken(payloadRefreshToken);
        }

        const accessToken: string = await this.authService.createAccessToken(
            payloadHashedAccessToken
        );

        const refreshToken: string = await this.authService.createRefreshToken(
            payloadHashedRefreshToken
        );

        const checkPasswordExpired: boolean =
            await this.authService.checkPasswordExpired(user.passwordExpired);

        if (checkPasswordExpired) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_SUCCESS.USER_PASSWORD_EXPIRED_ERROR,
                message: 'user.error.passwordExpired',
            });
        }

        const token = new AccessTokenEntity();
        token.userId = user.id;
        token.token = accessToken;

        const isTokenExist = await this.accessTokenRepo.getByToken(accessToken);
        if (!isTokenExist) {
            await this.accessTokenRepo.create(token);
        }

        return instanceToPlain({
            data: {
                tokenType,
                expiresIn,
                accessToken,
                refreshToken,
            },
        });
    }
}
