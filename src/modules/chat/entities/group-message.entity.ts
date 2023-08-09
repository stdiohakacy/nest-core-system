import { Column, Entity } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { GroupMessageDTO } from '../dtos/group-message.dto';

export interface IGroupMessageEntity extends IBaseEntity<GroupMessageDTO> {
    groupId: string;
    senderId: string;
    content: string;
}

@Entity({ name: 'group_messages' })
@UseDTO(GroupMessageDTO)
export class GroupMessageEntity
    extends BaseEntity<GroupMessageDTO>
    implements IGroupMessageEntity
{
    @Column({ name: 'groupId', type: 'uuid' })
    groupId: string;

    @Column({ name: 'senderId', type: 'uuid' })
    senderId: string;

    @Column({ name: 'content' })
    content: string;
}
