import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../../common/auth/auth.module';
import { LoggerModule } from '../../common/logger/logger.module';
import { MessagePublicController } from '../../common/message/controllers/message.public.controller';
import { SettingPublicController } from '../../common/setting/controllers/setting.public.controller';
import { SettingModule } from '../../common/setting/setting.module';
import { HealthPublicController } from '../../health/controllers/health.public.controller';
import { HealthModule } from '../../health/health.module';
import { UserPublicController } from '../../modules/user/controllers/user.public.controller';
import { UserModule } from '../../modules/user/user.module';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationPublicController } from '../../common/integrations/notification/fcm/controllers/notification.fcm.public.controller';

@Module({
    imports: [
        TerminusModule,
        HealthModule,
        UserModule,
        AuthModule,
        SettingModule,
        LoggerModule,
        CqrsModule,
    ],
    exports: [
        TerminusModule,
        HealthModule,
        UserModule,
        AuthModule,
        LoggerModule,
        SettingModule,
        LoggerModule,
    ],
    controllers: [
        HealthPublicController,
        MessagePublicController,
        SettingPublicController,
        UserPublicController,
        NotificationPublicController,
    ],
    providers: [],
})
export class RoutesPublicModule {}
