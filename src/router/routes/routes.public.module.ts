import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '@common/auth/auth.module';
import { HealthModule } from 'src/health/health.module';
import { HealthPublicController } from 'src/health/controllers/health.public.controller';
import { MessagePublicController } from '@common/message/controllers/message.public.controller';
import { SettingPublicController } from '@common/setting/controllers/setting.public.controller';
import { UserPublicController } from '@modules/user/controllers/user.public.controller';
import { UserModule } from '@modules/user/user.module';
import { RoleModule } from '@modules/role/role.module';
import { SettingModule } from '@common/setting/setting.module';
import { LoggerModule } from '@common/logger/logger.module';

@Module({
    imports: [
        TerminusModule,
        HealthModule,
        UserModule,
        AuthModule,
        RoleModule,
        SettingModule,
        LoggerModule,
    ],
    exports: [
        TerminusModule,
        HealthModule,
        UserModule,
        AuthModule,
        RoleModule,
        LoggerModule,
        SettingModule,
        LoggerModule,
    ],
    controllers: [
        HealthPublicController,
        MessagePublicController,
        SettingPublicController,
        UserPublicController,
    ],
    providers: [],
})
export class RoutesPublicModule {}
