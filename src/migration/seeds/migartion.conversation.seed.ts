import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ConversationRepository } from '../../modules/chat/repositories/conversation.repository';
import { UserRepository } from '../../modules/user/repositories/user.repository';
import { ConversationEntity } from '../../modules/chat/entities/conversation.entity';
import { MessageRepository } from '../../modules/chat/repositories/message.repository';
import { MessageEntity } from '../../modules/chat/entities/message.entity';
import { UserConversationRepository } from '../../modules/chat/repositories/user-conversation.repository';
import { UserConversationEntity } from '../../modules/chat/entities/user-conversation.entity';
import { ENUM_MESSAGE_STATUS } from '../../modules/chat/constants/message.enum.constant';

@Injectable()
export class MigrationConversationSeed {
    constructor(
        private readonly conversationRepo: ConversationRepository,
        private readonly userRepo: UserRepository,
        private readonly userConversationRepo: UserConversationRepository,
        private readonly messageRepo: MessageRepository
    ) {}

    @Command({ command: 'seed:conversation', describe: 'seeds conversations' })
    async seeds(): Promise<void> {
        const admin = await this.userRepo.findOneByUsername('admin');
        const user = await this.userRepo.findOneByUsername('user');

        const conversation = await this.conversationRepo.createGet(
            new ConversationEntity()
        );

        const userConversations = [
            {
                id: faker.string.uuid(),
                userId: admin.id,
                conversationId: conversation.id,
                name: `${user.firstName} ${user.lastName}`,
                lastMessage: faker.lorem.sentence(),
                lastTime: faker.date.recent(),
            },
            {
                id: faker.string.uuid(),
                userId: user.id,
                conversationId: conversation.id,
                name: `${admin.firstName} ${admin.lastName}`,
                lastMessage: faker.lorem.sentence(),
                lastTime: faker.date.recent(),
            },
        ].map((data) => {
            const { id, userId, conversationId, name, lastMessage, lastTime } =
                data;
            const userConversation = new UserConversationEntity();

            userConversation.id = id;
            userConversation.userId = userId;
            userConversation.conversationId = conversationId;
            userConversation.name = name;
            userConversation.lastMessage = lastMessage;
            userConversation.lastTime = lastTime;

            return userConversation;
        });

        await this.userConversationRepo.createMultiple(userConversations);

        const messages = [
            {
                id: faker.string.uuid(),
                content: faker.lorem.sentence(),
                fromUserId: user.id,
                conversationId: conversation.id,
            },
            {
                id: faker.string.uuid(),
                content: faker.lorem.sentence(),
                fromUserId: admin.id,
                conversationId: conversation.id,
            },
        ].map((data) => {
            const message = new MessageEntity();
            const { id, content, fromUserId, conversationId } = data;

            message.id = id;
            message.content = content;
            message.fromUserId = fromUserId;
            message.conversationId = conversationId;

            return message;
        });

        await this.messageRepo.createMultiple(messages);
    }

    @Command({
        command: 'remove:conversation',
        describe: 'remove conversations',
    })
    async remove(): Promise<void> {
        try {
            const conversationIds = (await this.conversationRepo.findAll()).map(
                (conversation) => conversation.id
            );
            await this.conversationRepo.deleteMultiple(conversationIds);
            const userConversationIds = (
                await this.userConversationRepo.findAll()
            ).map((userConversation) => userConversation.id);
            await this.userConversationRepo.deleteMultiple(userConversationIds);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
