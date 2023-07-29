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

export class DeviceRegisterCommand implements ICommand {
    constructor(
        public readonly payload: DeviceRegisterDTO,
        public readonly userAuth: UserEntity,
        public readonly userAgent: IResult
    ) {}
}

@CommandHandler(DeviceRegisterCommand)
export class DeviceRegisterHandler
    implements ICommandHandler<DeviceRegisterCommand>
{
    constructor(private readonly deviceRepo: NotificationFCMDeviceRepository) {}
    async execute({ payload, userAuth, userAgent }: DeviceRegisterCommand) {
        const { token } = payload;

        const device = new DeviceEntity();
        device.token = token;
        device.type = userAgent?.device?.type || '';
        device.userId = userAuth.id;

        await this.deviceRepo.create(device);
    }
}
