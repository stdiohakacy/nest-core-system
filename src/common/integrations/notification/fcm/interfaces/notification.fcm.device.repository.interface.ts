import { DeviceEntity } from '../../../../../modules/notification/entities/device.entity';

export interface INotificationFCMDeviceRepository {
    findByUserId(userId: string): Promise<DeviceEntity[]>;
    isDeviceExist(deviceType: string, userId: string): Promise<boolean>;
}
