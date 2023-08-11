import { UserEntity } from './../../user/entities/user.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { MessageDTO } from '../dtos/message.dto';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { ConversationEntity } from './conversation.entity';

export interface IMessageEntity extends IBaseEntity<MessageDTO> {
    content: string;
    fromUserId: string;
    conversationId: string;
}

@Entity({ name: 'messages' })
@UseDTO(MessageDTO)
export class MessageEntity
    extends BaseEntity<MessageDTO>
    implements IMessageEntity
{
    @Column({ name: 'content' })
    content: string;

    @Column({ name: 'fromUserId', type: 'uuid' })
    fromUserId: string;

    @Column({ name: 'conversationId', type: 'uuid' })
    conversationId: string;

    /* Relationship */

    @ManyToOne(() => UserEntity, (fromUser) => fromUser.messages)
    @JoinColumn({ name: 'fromUserId' })
    fromUser: UserEntity;

    @ManyToOne(
        () => ConversationEntity,
        (conversation) => conversation.messages
    )
    @JoinColumn({ name: 'conversationId' })
    conversation: ConversationEntity;
}
