import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../../common/auth/auth.module';
import { AwsModule } from '../../common/aws/aws.module';
import { LoggerModule } from '../../common/logger/logger.module';
import { SettingModule } from '../../common/setting/setting.module';
import { UserAuthController } from '../../modules/user/controllers/user.auth.controller';
import { UserModule } from '../../modules/user/user.module';
import { ChatModule } from '../../modules/chat/chat.module';
import { ConversationAuthController } from 'src/modules/chat/controllers/chat.auth.controller';

@Module({
    imports: [
        UserModule,
        AuthModule,
        AwsModule,
        LoggerModule,
        SettingModule,
        CqrsModule,
        ChatModule,
    ],
    controllers: [UserAuthController, ConversationAuthController],
    providers: [],
    exports: [UserModule, AuthModule, AwsModule, LoggerModule, SettingModule],
})
export class RoutesAuthModule {}
