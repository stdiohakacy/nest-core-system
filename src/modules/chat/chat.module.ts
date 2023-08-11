import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { ConversationListByUserHandler } from './queries/conversation.list-by-user.query';
import { ConversationRepository } from './repositories/conversation.repository';
import { UserConversationEntity } from './entities/user-conversation.entity';
import { UserConversationRepository } from './repositories/user-conversation.repository';
import { MessageEntity } from './entities/message.entity';
import { MessageRepository } from './repositories/message.repository';

const chatQueryHandlers = [ConversationListByUserHandler];
const repositories = [
    ConversationRepository,
    UserConversationRepository,
    MessageRepository,
];
@Module({
    imports: [
        TypeOrmModule.forFeature([
            ConversationEntity,
            UserConversationEntity,
            MessageEntity,
        ]),
    ],
    providers: [...chatQueryHandlers, ...repositories],
    exports: [...chatQueryHandlers, ...repositories],
})
export class ChatModule {}
