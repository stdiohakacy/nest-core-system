import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { AwsModule } from 'src/common/aws/aws.module';
import { LoggerModule } from 'src/common/logger/logger.module';
import { SettingModule } from 'src/common/setting/setting.module';
import { UserAuthController } from 'src/modules/user/controllers/user.auth.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [UserAuthController],
    providers: [],
    exports: [UserModule, AuthModule, AwsModule, LoggerModule, SettingModule],
    imports: [UserModule, AuthModule, AwsModule, LoggerModule, SettingModule],
})
export class RoutesAuthModule {}
