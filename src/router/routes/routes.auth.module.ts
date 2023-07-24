import { Module } from '@nestjs/common';
import { AuthModule } from '@common/auth/auth.module';
import { AwsModule } from '@common/aws/aws.module';
import { LoggerModule } from '@common/logger/logger.module';
import { SettingModule } from '@common/setting/setting.module';
import { UserAuthController } from '@modules/user/controllers/user.auth.controller';
import { UserModule } from '@modules/user/user.module';

@Module({
    controllers: [UserAuthController],
    providers: [],
    exports: [UserModule, AuthModule, AwsModule, LoggerModule, SettingModule],
    imports: [UserModule, AuthModule, AwsModule, LoggerModule, SettingModule],
})
export class RoutesAuthModule {}
