import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { ConversationListByUserHandler } from './queries/conversation.list-by-user.query';
import { ConversationRepository } from './repositories/conversation.repository';

const chatQueryHandlers = [ConversationListByUserHandler];
const repositories = [ConversationRepository];
@Module({
    imports: [TypeOrmModule.forFeature([ConversationEntity])],
    providers: [...chatQueryHandlers, ...repositories],
    exports: [...chatQueryHandlers, ...repositories],
})
export class ChatModule {}
