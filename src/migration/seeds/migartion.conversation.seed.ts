import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ConversationRepository } from '../../modules/chat/repositories/conversation.repository';
import { UserEntity } from '../../modules/user/entities/user.entity';
import { UserRepository } from '../../modules/user/repositories/user.repository';

@Injectable()
export class MigrationConversationSeed {
    constructor(
        private readonly conversationRepo: ConversationRepository,
        private readonly userRepo: UserRepository
    ) {}

    @Command({ command: 'seed:conversation', describe: 'seeds conversations' })
    async seeds(): Promise<void> {
        const users = await this.userRepo.find({ take: 2 });

        const createConversation = (user: UserEntity) => ({
            id: faker.string.uuid(),
            name: `${user.firstName} ${user.lastName}`,
            lastMessage: 'Hello',
            lastTime: faker.date.recent(),
            userId: user.id,
        });

        try {
            await this.conversationRepo.createMany(
                users.map((user) => createConversation(user))
            );
        } catch (err: any) {
            throw new Error(err.message);
        }
    }

    @Command({
        command: 'remove:conversation',
        describe: 'remove conversations',
    })
    async remove(): Promise<void> {
        try {
            await this.conversationRepo.truncate();
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
