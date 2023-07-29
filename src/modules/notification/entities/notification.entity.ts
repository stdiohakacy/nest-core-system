import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { NotificationDTO } from '../../../common/integrations/notification/fcm/dtos/notification.fcm.notification.dto';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { UserEntity } from '../../../modules/user/entities/user.entity';

export interface INotificationEntity extends IBaseEntity<NotificationDTO> {
    userId: string;
    title: string;
    body: string;
}

@Entity({ name: 'notifications' })
@UseDTO(NotificationDTO)
export class NotificationEntity
    extends BaseEntity<NotificationDTO>
    implements INotificationEntity
{
    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'body' })
    body: string;

    @ManyToOne(() => UserEntity, (user) => user.notifications)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}
