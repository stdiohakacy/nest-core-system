import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { ConversationDTO } from '../dtos/conversation.dto';
import { MessageEntity } from './message.entity';
import { UserEntity } from '../../../modules/user/entities/user.entity';

export interface IConversationEntity extends IBaseEntity<ConversationDTO> {
    name: string;
    lastMessage: string;
    lastTime: Date;
    userId: string;
}

@Entity({ name: 'conversations' })
@UseDTO(ConversationDTO)
export class ConversationEntity
    extends BaseEntity<ConversationDTO>
    implements IConversationEntity
{
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'lastMessage' })
    lastMessage: string;

    @Column({ name: 'lastTime' })
    lastTime: Date;

    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    /* Relationships */

    @OneToMany(() => MessageEntity, (messages) => messages.conversation)
    messages: MessageEntity[];

    @ManyToOne(() => UserEntity, (user) => user.conversations)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}
