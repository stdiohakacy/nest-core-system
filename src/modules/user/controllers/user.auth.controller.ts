import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { AuthService } from '../../../common/auth/services/auth.service';
import { SettingService } from '../../../common/setting/services/setting.service';
import { AwsS3Service } from '../../../common/aws/services/aws.s3.service';
import {
    UserAuthChangePasswordDoc,
    UserAuthClaimUsernameDoc,
    UserAuthInfoDoc,
    UserAuthProfileDoc,
    UserAuthRefreshDoc,
    UserAuthUpdateProfileDoc,
    UserAuthUploadProfileDoc,
} from '../docs/user.auth.doc';
import { Response } from '../../../common/response/decorators/response.decorator';
import { UserRefreshSerialization } from '../serializations/user.refresh.serialization';
import {
    GetUser,
    UserAuthProtected,
    UserProtected,
} from '../decorators/user.decorator';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
    AuthJwtRefreshProtected,
    AuthJwtToken,
} from '../../../common/auth/decorators/auth.jwt.decorator';
import { IResponse } from '../../../common/response/interfaces/response.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { UserChangePasswordDTO } from '../dtos/user.change-password.dto';
import { IAuthPassword } from '../../../common/auth/interfaces/auth.interface';
import { UserProfileSerialization } from '../serializations/user.profile.serialization';
import { UserUpdateNameDTO } from '../dtos/user.update-name.dto';
import { UserUpdateUsernameDTO } from '../dtos/user.update-username.dto';
import { UploadFileSingle } from '../../../common/file/decorators/file.decorator';
import { FileRequiredPipe } from '../../../common/file/pipes/file.required.pipe';
import { FileSizeImagePipe } from '../../../common/file/pipes/file.size.pipe';
import { FileTypeImagePipe } from '../../../common/file/pipes/file.type.pipe';
import { IFile } from '../../../common/file/interfaces/file.interface';
import { AwsS3Serialization } from '../../../common/aws/serializations/aws.s3.serialization';

@ApiTags('modules.auth.user')
@Controller({
    version: '1',
    path: '/user',
})
export class UserAuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly settingService: SettingService,
        private readonly awsS3Service: AwsS3Service
    ) {}

    @UserAuthRefreshDoc()
    @Response('user.refresh', { serialization: UserRefreshSerialization })
    @UserAuthProtected()
    @UserProtected()
    @AuthJwtRefreshProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    async refresh(
        @AuthJwtToken() refreshToken: string,
        @GetUser() user: UserEntity
    ): Promise<IResponse> {
        const checkPasswordExpired: boolean =
            await this.authService.checkPasswordExpired(user.passwordExpired);

        if (checkPasswordExpired) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_EXPIRED_ERROR,
                message: 'user.error.passwordExpired',
            });
        }

        const payload: UserPayloadSerialization =
            await this.userService.payloadSerialization(user);
        const tokenType: string = await this.authService.getTokenType();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const payloadAccessToken: Record<string, any> =
            await this.authService.createPayloadAccessToken(payload);

        const payloadEncryption = await this.authService.getPayloadEncryption();
        let payloadHashedAccessToken: Record<string, any> | string =
            payloadAccessToken;

        if (payloadEncryption) {
            payloadHashedAccessToken =
                await this.authService.encryptAccessToken(payloadAccessToken);
        }

        const accessToken: string = await this.authService.createAccessToken(
            payloadHashedAccessToken
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

    @UserAuthChangePasswordDoc()
    @Response('user.changePassword')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/change-password')
    async changePassword(
        @Body() body: UserChangePasswordDTO,
        @GetUser() user: UserEntity
    ): Promise<void> {
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

        const matchPassword: boolean = await this.authService.validateUser(
            body.oldPassword,
            user.password
        );
        if (!matchPassword) {
            await this.userService.increasePasswordAttempt(user);

            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
                message: 'user.error.passwordNotMatch',
            });
        }

        const newMatchPassword: boolean = await this.authService.validateUser(
            body.newPassword,
            user.password
        );
        if (newMatchPassword) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
                message: 'user.error.newPasswordMustDifference',
            });
        }

        await this.userService.resetPasswordAttempt(user);

        const password: IAuthPassword = await this.authService.createPassword(
            body.newPassword
        );

        await this.userService.updatePassword(user, password);
    }

    @UserAuthInfoDoc()
    @Response('user.info', { serialization: UserPayloadSerialization })
    @AuthJwtAccessProtected()
    @Get('/info')
    async info(
        @AuthJwtPayload() payload: UserPayloadSerialization
    ): Promise<IResponse> {
        return { data: payload };
    }

    @UserAuthProfileDoc()
    @Response('user.profile', {
        serialization: UserProfileSerialization,
    })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/profile')
    async profile(@GetUser() user: UserEntity): Promise<IResponse> {
        return { data: user };
    }

    @UserAuthUpdateProfileDoc()
    @Response('user.updateProfile')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/profile/update')
    async updateProfile(
        @GetUser() user: UserEntity,
        @Body() body: UserUpdateNameDTO
    ): Promise<void> {
        await this.userService.updateName(user, body);

        return;
    }

    @UserAuthClaimUsernameDoc()
    @Response('user.claimUsername')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/profile/claim-username')
    async claimUsername(
        @GetUser() user: UserEntity,
        @Body() { username }: UserUpdateUsernameDTO
    ): Promise<void> {
        const checkUsername: boolean = await this.userService.existByUsername(
            username
        );
        if (checkUsername) {
            throw new ConflictException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
                message: 'user.error.usernameExist',
            });
        }

        await this.userService.updateUsername(user, { username });

        return;
    }

    @UserAuthUploadProfileDoc()
    @Response('user.upload')
    @UserProtected()
    @AuthJwtAccessProtected()
    @UploadFileSingle('file')
    @HttpCode(HttpStatus.OK)
    @Post('/profile/upload')
    async upload(
        @GetUser() user: UserEntity,
        @UploadedFile(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
        file: IFile
    ): Promise<void> {
        const filename: string = file.originalname;
        const content: Buffer = file.buffer;
        const mime: string = filename
            .substring(filename.lastIndexOf('.') + 1, filename.length)
            .toLowerCase();

        const path = await this.userService.createPhotoFilename();

        const aws: AwsS3Serialization = await this.awsS3Service.putItemInBucket(
            `${path.filename}.${mime}`,
            content,
            {
                path: `${path.path}/${user.id}`,
            }
        );
        await this.userService.updatePhoto(user.id, aws);
    }
}
