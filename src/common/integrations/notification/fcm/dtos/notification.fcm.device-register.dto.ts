import { PickType } from '@nestjs/swagger';
import { DeviceDTO } from './notification.fcm.device.dto';

export class DeviceRegisterDTO extends PickType(DeviceDTO, [
    'token',
    'userId',
]) {}
