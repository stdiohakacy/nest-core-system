import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { DeviceDTO } from '../../../common/integrations/notification/fcm/dtos/notification.fcm.device.dto';
import { UserEntity } from '../../../modules/user/entities/user.entity';

export interface IDeviceEntity extends IBaseEntity<DeviceDTO> {
    type: string;
    token: string;
    userId: string;
}

@Entity({ name: 'devices' })
@UseDTO(DeviceDTO)
export class DeviceEntity
    extends BaseEntity<DeviceDTO>
    implements IDeviceEntity
{
    @Column({ name: 'type' })
    type: string;

    @Column({ name: 'token' })
    token: string;

    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @ManyToOne(() => UserEntity, (user) => user.devices)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}
