import { Module } from '@nestjs/common';
import { AuthModule } from '../../common/auth/auth.module';
import { AwsModule } from '../../common/aws/aws.module';
import { LoggerModule } from '../../common/logger/logger.module';
import { SettingModule } from '../../common/setting/setting.module';
import { UserAuthController } from '../../modules/user/controllers/user.auth.controller';
import { UserModule } from '../../modules/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [
        UserModule,
        AuthModule,
        AwsModule,
        LoggerModule,
        SettingModule,
        CqrsModule,
    ],
    controllers: [UserAuthController],
    providers: [],
    exports: [UserModule, AuthModule, AwsModule, LoggerModule, SettingModule],
})
export class RoutesAuthModule {}
