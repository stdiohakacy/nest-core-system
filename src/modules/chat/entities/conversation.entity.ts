import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { ConversationDTO } from '../dtos/conversation.dto';
import { MessageEntity } from './message.entity';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { UserConversationEntity } from './user-conversation.entity';

export interface IConversationEntity extends IBaseEntity<ConversationDTO> {}

@Entity({ name: 'conversations' })
@UseDTO(ConversationDTO)
export class ConversationEntity
    extends BaseEntity<ConversationDTO>
    implements IConversationEntity
{
    /* Relationships */

    @OneToMany(() => MessageEntity, (messages) => messages.conversation)
    messages: MessageEntity[];

    @OneToMany(
        () => UserConversationEntity,
        (userConversations) => userConversations.conversation
    )
    userConversations: UserConversationEntity[];
}
