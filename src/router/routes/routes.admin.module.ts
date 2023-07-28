import { Module } from '@nestjs/common';
import { ApiKeyModule } from '../../common/api-key/api-key.module';
import { ApiKeyAdminController } from '../../common/api-key/controllers/api-key.admin.controller';
import { AuthModule } from '../../common/auth/auth.module';
import { LoggerModule } from '../../common/logger/logger.module';
import { SettingAdminController } from '../../common/setting/controllers/setting.admin.controller';
import { SettingModule } from '../../common/setting/setting.module';
import { UserAdminController } from '../../modules/user/controllers/user.admin.controller';
import { UserModule } from '../../modules/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    controllers: [
        SettingAdminController,
        ApiKeyAdminController,
        UserAdminController,
    ],
    providers: [],
    exports: [
        ApiKeyModule,
        UserModule,
        AuthModule,
        SettingModule,
        LoggerModule,
    ],
    imports: [
        CqrsModule,
        ApiKeyModule,
        UserModule,
        AuthModule,
        SettingModule,
        LoggerModule,
    ],
})
export class RoutesAdminModule {}
