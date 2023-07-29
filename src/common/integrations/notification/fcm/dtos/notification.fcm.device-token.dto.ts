import { PickType } from '@nestjs/swagger';
import { DeviceDTO } from './notification.fcm.device.dto';

export class DeviceTokenDTO extends PickType(DeviceDTO, ['token']) {}
