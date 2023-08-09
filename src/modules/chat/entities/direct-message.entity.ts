import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { DirectMessageDTO } from '../dtos/direct-message.dto';

export interface IDirectMessageEntity extends IBaseEntity<DirectMessageDTO> {
    senderId: string;
    receiverId: string;
    content: string;
}

@Entity({ name: 'direct_messages' })
@UseDTO(DirectMessageDTO)
export class DirectMessageEntity
    extends BaseEntity<DirectMessageDTO>
    implements IDirectMessageEntity
{
    @Column({ name: 'senderId', type: 'uuid' })
    senderId: string;

    @Column({ name: 'type', type: 'uuid' })
    receiverId: string;

    @Column({ name: 'type' })
    content: string;
}
