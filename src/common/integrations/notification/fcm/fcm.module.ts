import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { DeviceRegisterHandler } from './commands/notification.device-register.command';
import { NotificationFCMDeviceRepository } from './repositories/notification.fcm.device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/modules/notification/entities/device.entity';
import { NotificationPushHandler } from './commands/notification.noti-push.command';

const commandHandlers = [
    DeviceRegisterHandler,
    DeviceRegisterHandler,
    NotificationPushHandler,
];
const repositories = [NotificationFCMDeviceRepository];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([DeviceEntity])],
    exports: [...commandHandlers, ...repositories],
    providers: [...commandHandlers, ...repositories],
})
export class FCMModule {}
