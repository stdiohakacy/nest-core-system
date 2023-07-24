import { Module } from '@nestjs/common';
import { ApiKeyModule } from 'src/common/api-key/api-key.module';
import { ApiKeyAdminController } from 'src/common/api-key/controllers/api-key.admin.controller';
import { AuthModule } from 'src/common/auth/auth.module';
import { RoleAdminController } from 'src/modules/role/controllers/role.admin.controller';
import { RoleModule } from 'src/modules/role/role.module';
import { SettingAdminController } from 'src/common/setting/controllers/setting.admin.controller';
import { UserAdminController } from 'src/modules/user/controllers/user.admin.controller';
import { UserModule } from 'src/modules/user/user.module';
import { SettingModule } from 'src/common/setting/setting.module';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
    controllers: [
        SettingAdminController,
        ApiKeyAdminController,
        RoleAdminController,
        UserAdminController,
    ],
    providers: [],
    exports: [
        ApiKeyModule,
        RoleModule,
        UserModule,
        AuthModule,
        SettingModule,
        LoggerModule,
    ],
    imports: [
        ApiKeyModule,
        RoleModule,
        UserModule,
        AuthModule,
        SettingModule,
        LoggerModule,
    ],
})
export class RoutesAdminModule {}
