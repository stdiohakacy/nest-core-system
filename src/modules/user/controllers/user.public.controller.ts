import { AccessTokenEntity } from '../../../modules/access-token/entities/access-token.entity';
import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { AuthService } from '../../../common/auth/services/auth.service';
import {
    UserPublicActiveDoc,
    UserPublicForgotPasswordDoc,
    UserPublicLoginDoc,
    UserPublicPhoneConfirmDoc,
    UserPublicResetPasswordDoc,
    UserPublicSignUpDoc,
} from '../docs/user.public.doc';
import { Response } from '../../../common/response/decorators/response.decorator';
import { UserLoginSerialization } from '../serializations/user.login.serialization';
import { UserLoginDTO } from '../dtos/user.login.dto';
import { IResponse } from '../../../common/response/interfaces/response.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { ENUM_AUTH_LOGIN_WITH } from '../../../common/auth/constants/auth.enum.constant';
import { UserSignUpDTO } from '../dtos/user.sign-up.dto';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import {
    AuthGoogleOAuth2LoginProtected,
    AuthGoogleOAuth2SignUpProtected,
} from '../../../common/auth/decorators/auth.google.decorator';
import { AuthJwtPayload } from '../../../common/auth/decorators/auth.jwt.decorator';
import { IAuthGooglePayload } from '../../../common/auth/interfaces/auth.interface';
import { ENUM_ERROR_STATUS_CODE_ERROR } from '../../../common/error/constants/error.status-code.constant';
import { MailService } from '../../../common/integrations/mail/services/mail.service';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UserActiveDTO } from '../dtos/user.active.dto';
import { CommandBus } from '@nestjs/cqrs';
import { UserActiveCommand } from '../commands/user.active.command';
import { UserForgotPasswordDTO } from '../dtos/user.forgot-password.dto';
import { UserForgotPasswordCommand } from '../commands/user.forgot-password.command';
import { UserResetPasswordDTO } from '../dtos/user.reset-password.dto';
import { UserResetPasswordCommand } from '../commands/user.reset-password.command';
import { Transactional } from 'typeorm-transactional';
import { UserLoginCommand } from '../commands/user.login.command';
import TwilioService from '../../../common/integrations/sms/twilio/services/twilio.service';
import { UserPhoneConfirmDTO } from '../dtos/user.phone-confirmation.dto';
import { UserPhoneConfirmCommand } from '../commands/user.confirm-phone.command';
import { LogstashService } from '../../../common/logger/services/logger.logstash.service';

@ApiTags('modules.public.user')
@Controller({ version: '1', path: '/user' })
export class UserPublicController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        private readonly configService: ConfigService,
        private readonly commandBus: CommandBus,
        private readonly twilioService: TwilioService,
        private readonly logstashService: LogstashService
    ) {}

    @UserPublicLoginDoc()
    @Response('user.login', { serialization: UserLoginSerialization })
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Body() payload: UserLoginDTO): Promise<IResponse> {
        return await this.commandBus.execute(new UserLoginCommand(payload));
    }

    @UserPublicSignUpDoc()
    @Response('user.signUp')
    @Transactional()
    @Post('/sign-up')
    async signUp(
        @Body()
        payload: UserSignUpDTO
    ): Promise<void> {
        const { email, mobileNumber, username, ...body } = payload;
        const promises: Promise<any>[] = [this.userService.existByEmail(email)];
        if (mobileNumber) {
            promises.push(this.userService.existByMobileNumber(mobileNumber));
        }
        if (username) {
            promises.push(this.userService.existByUsername(username));
        }
        const [emailExist, mobileNumberExist, usernameExist] =
            await Promise.all(promises);
        if (emailExist) {
            throw new ConflictException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
                message: 'user.error.emailExist',
            });
        } else if (mobileNumberExist) {
            throw new ConflictException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
                message: 'user.error.mobileNumberExist',
            });
        } else if (usernameExist) {
            throw new ConflictException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
                message: 'user.error.usernameExist',
            });
        }
        const password = await this.authService.createPassword(body.password);
        const activeKey = randomBytes(32).toString('hex');
        await this.userService.create(
            {
                username,
                email,
                mobileNumber,
                signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
                activeKey,
                ...body,
            },
            password
        );
        const appProtocol = this.configService.get<string>('app.protocol');
        const httpHost = this.configService.get<string>('app.http.host');
        const httpPort = this.configService.get<string>('app.http.port');
        const activationLink = `${appProtocol}://${httpHost}:${httpPort}/confirm-account?username=${payload.username}&key=${payload.activeKey}`;
        this.mailService.sendAccountActivation({
            activationLink,
            name: `${payload.firstName} ${payload.lastName}`,
        });
        // const result = await this.twilioService.initPhoneNumberVerification(
        //     payload.mobileNumber
        // );
        // console.log(result);
    }

    @ApiExcludeEndpoint()
    @Response('user.loginGoogle')
    @AuthGoogleOAuth2LoginProtected()
    @Get('/login/google')
    async loginGoogle(): Promise<void> {
        return;
    }

    @ApiExcludeEndpoint()
    @Response('user.loginGoogleCallback')
    @AuthGoogleOAuth2LoginProtected()
    @Get('/login/google/callback')
    async loginGoogleCallback(
        @AuthJwtPayload()
        {
            email,
            accessToken: googleAccessToken,
            refreshToken: googleRefreshToken,
        }: IAuthGooglePayload
    ): Promise<IResponse> {
        const user: UserEntity = await this.userService.findOneByEmail(email);

        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
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

        await this.userService.updateGoogleSSO(user, {
            accessToken: googleAccessToken,
            refreshToken: googleRefreshToken,
        });

        const payload: UserPayloadSerialization =
            await this.userService.payloadSerialization(user);
        const tokenType: string = await this.authService.getTokenType();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const payloadAccessToken: Record<string, any> =
            await this.authService.createPayloadAccessToken(payload);
        const payloadRefreshToken: Record<string, any> =
            await this.authService.createPayloadRefreshToken(payload.id, {
                loginWith: ENUM_AUTH_LOGIN_WITH.GOOGLE,
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

        return {
            data: {
                tokenType,
                expiresIn,
                accessToken,
                refreshToken,
            },
        };
    }

    @ApiExcludeEndpoint()
    @Response('user.signUpGoogle')
    @AuthGoogleOAuth2SignUpProtected()
    @Get('/sign-up/google')
    async signUpGoogle(): Promise<void> {
        return;
    }

    @ApiExcludeEndpoint()
    @Response('user.signUpGoogleCallback')
    @AuthGoogleOAuth2SignUpProtected()
    @HttpCode(HttpStatus.CREATED)
    @Get('/sign-up/google/callback')
    async signUpGoogleCallback(
        @AuthJwtPayload()
        {
            email,
            firstName,
            lastName,
            accessToken: googleAccessToken,
            refreshToken: googleRefreshToken,
        }: IAuthGooglePayload
    ): Promise<void> {
        // sign up

        const promises: Promise<any>[] = [this.userService.existByEmail(email)];

        const [emailExist] = await Promise.all(promises);

        if (emailExist) {
            throw new ConflictException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
                message: 'user.error.emailExist',
            });
        }

        try {
            const passwordString =
                await this.authService.createPasswordRandom();
            const password = await this.authService.createPassword(
                passwordString
            );

            const user: UserEntity = await this.userService.create(
                {
                    email,
                    firstName,
                    lastName,
                    password: passwordString,
                    signUpFrom: ENUM_USER_SIGN_UP_FROM.GOOGLE,
                },
                password
            );

            await this.userService.updateGoogleSSO(user, {
                accessToken: googleAccessToken,
                refreshToken: googleRefreshToken,
            });
        } catch (err: any) {
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }
    }

    @UserPublicActiveDoc()
    @Response('user.active')
    @Transactional()
    @Post('/active')
    async active(
        @Body()
        payload: UserActiveDTO
    ): Promise<IResponse> {
        return await this.commandBus.execute(new UserActiveCommand(payload));
    }

    @UserPublicForgotPasswordDoc()
    @Response('user.forgotPassword')
    @Transactional()
    @Post('/forgot-password')
    async forgotPassword(
        @Body()
        payload: UserForgotPasswordDTO
    ): Promise<IResponse> {
        return await this.commandBus.execute(
            new UserForgotPasswordCommand(payload)
        );
    }

    @UserPublicResetPasswordDoc()
    @Response('user.resetPassword')
    @Transactional()
    @Post('/reset-password')
    async resetPassword(
        @Body()
        payload: UserResetPasswordDTO
    ): Promise<IResponse> {
        return await this.commandBus.execute(
            new UserResetPasswordCommand(payload)
        );
    }

    @UserPublicPhoneConfirmDoc()
    @Response('user.confirmPhone')
    @Transactional()
    @Post('/phone-confirm')
    async confirmPhone(
        @Body() payload: UserPhoneConfirmDTO
    ): Promise<IResponse> {
        return await this.commandBus.execute(
            new UserPhoneConfirmCommand(payload)
        );
    }
}
