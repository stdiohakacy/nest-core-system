import { Global, Module } from '@nestjs/common';
import { NotificationFCMDeviceRepository } from './repositories/notification.fcm.device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/modules/notification/entities/device.entity';
import { DeviceRegisterHandler } from './commands/notification.device-register.command';
import { FCMService } from './services/notification.fcm.service';
import { NotificationFCMNotificationRepository } from './repositories/notification.fcm.notification.repository';

const commandHandlers = [DeviceRegisterHandler];
const repositories = [
    NotificationFCMDeviceRepository,
    NotificationFCMNotificationRepository,
];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([DeviceEntity])],
    providers: [...commandHandlers, ...repositories, FCMService],
    exports: [...commandHandlers, ...repositories, FCMService],
})
export class FCMModule {}
