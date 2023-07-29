import { Global, Module } from '@nestjs/common';
import { NotificationFCMDeviceRepository } from './repositories/notification.fcm.device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from 'src/modules/notification/entities/device.entity';
import { DeviceRegisterHandler } from './commands/notification.device-register.command';
import { FCMService } from './services/notification.fcm.service';

const commandHandlers = [DeviceRegisterHandler];
const repositories = [NotificationFCMDeviceRepository];

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([DeviceEntity])],
    providers: [...commandHandlers, ...repositories, FCMService],
    exports: [...commandHandlers, ...repositories, FCMService],
})
export class FCMModule {}
