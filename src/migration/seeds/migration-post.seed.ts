import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { ApiKeyService } from '../../common/api-key/services/api-key.service';
import { ENUM_API_KEY_TYPE } from '../../common/api-key/constants/api-key.enum.constant';
import { faker } from '@faker-js/faker';
import { PostRepository } from 'src/modules/post/repositories/post.repository';

@Injectable()
export class MigrationPostSeed {
    constructor(private readonly postRepo: PostRepository) {}

    @Command({ command: 'seed:post', describe: 'seeds posts' })
    async seeds(): Promise<void> {
        try {
            const posts = [
                {
                    id: faker.string.uuid(),
                    title: 'Post',
                    content: faker.lorem.sentence(),
                },
                {
                    id: faker.string.uuid(),
                    title: 'Post',
                    content: faker.lorem.sentence(),
                },
                {
                    id: faker.string.uuid(),
                    title: 'Post',
                    content: faker.lorem.sentence(),
                },
                {
                    id: faker.string.uuid(),
                    title: 'Post',
                    content: faker.lorem.sentence(),
                },
                {
                    id: faker.string.uuid(),
                    title: 'Post',
                    content: faker.lorem.sentence(),
                },
            ];

            await this.postRepo.createMany(posts);
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({
        command: 'remove:post',
        describe: 'remove posts',
    })
    async remove(): Promise<void> {
        try {
            await this.postRepo.deleteMany();
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
