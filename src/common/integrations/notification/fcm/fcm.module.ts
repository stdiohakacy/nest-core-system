import { Module } from '@nestjs/common';
import { NotificationFCMDeviceRepository } from './repositories/notification.fcm.device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/modules/notification/entities/device.entity';
import { DeviceRegisterHandler } from './commands/notification.device-register.command';
import { FCMService } from './services/notification.fcm.service';
import { NotificationFCMNotificationRepository } from './repositories/notification.fcm.notification.repository';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';

const commandHandlers = [DeviceRegisterHandler];
const repositories = [
    NotificationFCMDeviceRepository,
    NotificationFCMNotificationRepository,
];

@Module({
    imports: [TypeOrmModule.forFeature([DeviceEntity, NotificationEntity])],
    providers: [...commandHandlers, ...repositories, FCMService],
    exports: [...commandHandlers, ...repositories, FCMService],
})
export class FCMModule {}
