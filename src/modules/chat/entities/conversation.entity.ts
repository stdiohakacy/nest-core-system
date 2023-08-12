import { Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { ConversationDTO } from '../dtos/conversation.dto';
import { MessageEntity } from './message.entity';
import { UserConversationEntity } from './user-conversation.entity';

@Entity({ name: 'conversations' })
@UseDTO(ConversationDTO)
export class ConversationEntity extends BaseEntity<ConversationDTO> {
    
    /* Relationships */

    @OneToMany(() => MessageEntity, (messages) => messages.conversation)
    messages: MessageEntity[];

    @OneToMany(
        () => UserConversationEntity,
        (userConversations) => userConversations.conversation
    )
    userConversations: UserConversationEntity[];
}
