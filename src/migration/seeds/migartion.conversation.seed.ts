import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ConversationRepository } from '../../modules/chat/repositories/conversation.repository';
import { UserRepository } from '../../modules/user/repositories/user.repository';
import { ConversationEntity } from '../../modules/chat/entities/conversation.entity';
import { UserConversationRepository } from '../../modules/chat/repositories/user-conversation.repository';
import { MessageRepository } from '../../modules/chat/repositories/message.repository';

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

        const conversation = await this.conversationRepo.create(
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
        ];

        await this.userConversationRepo.createMany(userConversations);

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
        ];
        await this.messageRepo.createMany(messages);
    }

    @Command({
        command: 'remove:conversation',
        describe: 'remove conversations',
    })
    async remove(): Promise<void> {
        try {
            await this.conversationRepo.truncate();
            await this.userConversationRepo.truncate();
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
