import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { DeviceRegisterDTO } from '../dtos/notification.fcm.device-register.dto';
import { UserEntity } from '../../../../../modules/user/entities/user.entity';
import { NotificationFCMDeviceRepository } from '../repositories/notification.fcm.device.repository';
import { DeviceEntity } from '../../../../../modules/notification/entities/device.entity';
import { IResult } from 'ua-parser-js';
import { FCMService } from '../services/notification.fcm.service';
import { NotificationFCMNotificationRepository } from '../repositories/notification.fcm.notification.repository';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';

export class DeviceRegisterCommand implements ICommand {
    constructor(
        public readonly payload: DeviceRegisterDTO,
        public readonly userAgent: IResult
    ) {}
}

@CommandHandler(DeviceRegisterCommand)
export class DeviceRegisterHandler
    implements ICommandHandler<DeviceRegisterCommand>
{
    constructor(
        private readonly deviceRepo: NotificationFCMDeviceRepository,
        private readonly notificationRepo: NotificationFCMNotificationRepository,
        private readonly fcmService: FCMService
    ) {}
    async execute({ payload, userAgent }: DeviceRegisterCommand) {
        const { token, userId } = payload;

        const device = new DeviceEntity();
        device.token = token;
        device.type = userAgent?.device?.type || 'web';
        device.userId = userId;

        const isDeviceExist = await this.deviceRepo.isDeviceExist(
            device.type,
            userId
        );
        if (!isDeviceExist) {
            await this.deviceRepo.create(device);
        }

        const notification = new NotificationEntity();
        notification.title = 'Congratulation';
        notification.body = 'Register device succeed';
        notification.userId = userId;

        await this.notificationRepo.create(notification);
        await this.fcmService.pushNotification(token, {
            title: 'Congratulation',
            body: 'Register device succeed',
            // imageUrl: '',
        });
    }
}
