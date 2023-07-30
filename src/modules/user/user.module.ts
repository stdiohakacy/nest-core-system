import { AuthModule } from './../../common/auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserEntity } from './entities/user.entity';
import { IntegrationModule } from '../../common/integrations/integration.module';
import { UserActiveHandler } from './commands/user.active.command';
import { UserRepository } from './repositories/user.repository';
import { UserForgotPasswordHandler } from './commands/user.forgot-password.command';
import { UserResetPasswordHandler } from './commands/user.reset-password.command';
import { AccessTokenModule } from '../access-token/access-token.module';
import { UserRevokeHandler } from './commands/user.revoke.command';
import { UserUploadMinioHandler } from './commands/user.upload.minio.command';
import { UserLoginHandler } from './commands/user.login.command';
import { SettingModule } from '../../common/setting/setting.module';
import { UserPhoneConfirmHandler } from './commands/user.confirm-phone.command';

const commandHandlers = [
    UserActiveHandler,
    UserForgotPasswordHandler,
    UserResetPasswordHandler,
    UserRevokeHandler,
    UserUploadMinioHandler,
    UserLoginHandler,
    UserPhoneConfirmHandler,
];
const repositories = [UserRepository];

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        IntegrationModule,
        AuthModule,
        AccessTokenModule,
        SettingModule,
    ],
    exports: [
        UserService,
        IntegrationModule,
        AccessTokenModule,
        ...repositories,
    ],
    providers: [...commandHandlers, ...repositories, UserService],
    controllers: [],
})
export class UserModule {}
