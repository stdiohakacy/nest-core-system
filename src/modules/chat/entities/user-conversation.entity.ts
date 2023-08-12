import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { UserConversationDTO } from '../dtos/user-conversation.dto';
import { ConversationEntity } from './conversation.entity';

export interface IUserConversationEntity
    extends IBaseEntity<UserConversationDTO> {
    userId: string;
    conversationId: string;
    name: string;
    lastMessage: string;
    lastTime: Date;
}

@Entity({ name: 'user_conversations' })
@UseDTO(UserConversationDTO)
export class UserConversationEntity
    extends BaseEntity<UserConversationDTO>
    implements IUserConversationEntity
{
    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @Column({ name: 'conversationId', type: 'uuid' })
    conversationId: string;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'lastMessage' })
    lastMessage: string;

    @Column({ name: 'lastTime' })
    lastTime: Date;

    /* Relationships */

    @ManyToOne(() => UserEntity, (user) => user.userConversations)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne(
        () => ConversationEntity,
        (conversation) => conversation.userConversations
    )
    @JoinColumn({ name: 'conversationId' })
    conversation: ConversationEntity;
}
