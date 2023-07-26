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
import { RoleService } from '../../../modules/role/services/role.service';
import { SettingService } from '../../../common/setting/services/setting.service';
import {
    UserPublicLoginDoc,
    UserPublicSignUpDoc,
} from '../docs/user.public.doc';
import { Response } from '../../../common/response/decorators/response.decorator';
import { UserLoginSerialization } from '../serializations/user.login.serialization';
import { UserLoginDto } from '../dtos/user.login.dto';
import { IResponse } from '../../../common/response/interfaces/response.interface';
import {
    ENUM_USER_STATUS_CODE_ERROR,
    ENUM_USER_STATUS_CODE_SUCCESS,
} from '../constants/user.status-code.constant';
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

@ApiTags('modules.public.user')
@Controller({
    version: '1',
    path: '/user',
})
export class UserPublicController {
    constructor(
        // @DatabaseConnection() private readonly databaseConnection: Connection,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly roleService: RoleService,
        private readonly settingService: SettingService
    ) {}

    @UserPublicLoginDoc()
    @Response('user.login', { serialization: UserLoginSerialization })
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Body() { email, password }: UserLoginDto): Promise<IResponse> {
        const user: UserEntity = await this.userService.findOneByEmail(email);
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

        // const userWithRole: IUserDoc = await this.userService.joinWithRole(
        //     user
        // );
        // if (!userWithRole.role.isActive) {
        //     throw new ForbiddenException({
        //         statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
        //         message: 'role.error.inactive',
        //     });
        // }

        await this.userService.resetPasswordAttempt(user);

        const payload: UserPayloadSerialization =
            await this.userService.payloadSerialization(user);
        const tokenType: string = await this.authService.getTokenType();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const payloadAccessToken: Record<string, any> =
            await this.authService.createPayloadAccessToken(payload);
        const payloadRefreshToken: Record<string, any> =
            await this.authService.createPayloadRefreshToken(payload.id, {
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

        return {
            data: {
                tokenType,
                expiresIn,
                accessToken,
                refreshToken,
            },
        };
    }

    @UserPublicSignUpDoc()
    @Response('user.signUp')
    @Post('/sign-up')
    async signUp(
        @Body()
        { email, mobileNumber, ...body }: UserSignUpDTO
    ): Promise<void> {
        const promises: Promise<any>[] = [this.userService.existByEmail(email)];

        if (mobileNumber) {
            promises.push(this.userService.existByMobileNumber(mobileNumber));
        }

        const [emailExist, mobileNumberExist] = await Promise.all(promises);

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
        }

        const password = await this.authService.createPassword(body.password);

        await this.userService.create(
            {
                email,
                mobileNumber,
                signUpFrom: ENUM_USER_SIGN_UP_FROM.LOCAL,
                ...body,
            },
            password
        );
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

        // const userWithRole: IUserDoc = await this.userService.joinWithRole(
        //     user
        // );
        // if (!userWithRole.role.isActive) {
        //     throw new ForbiddenException({
        //         statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
        //         message: 'role.error.inactive',
        //     });
        // }

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

        const promises: Promise<any>[] = [
            this.roleService.findOneByName('user'),
            this.userService.existByEmail(email),
        ];

        const [role, emailExist] = await Promise.all(promises);

        if (emailExist) {
            throw new ConflictException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
                message: 'user.error.emailExist',
            });
        }

        // const session: ClientSession =
        //     await this.databaseConnection.startSession();
        // session.startTransaction();

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

            await this.userService.updateGoogleSSO(
                user,
                {
                    accessToken: googleAccessToken,
                    refreshToken: googleRefreshToken,
                }
                // { session }
            );

            // await session.commitTransaction();
            // await session.endSession();
        } catch (err: any) {
            // await session.abortTransaction();
            // await session.endSession();

            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        }
    }
}
