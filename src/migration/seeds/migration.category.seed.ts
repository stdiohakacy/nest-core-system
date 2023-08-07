import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../modules/category/repositories/category.repository';
import { faker } from '@faker-js/faker';

@Injectable()
export class MigrationCategorySeed {
    constructor(private readonly categoryRepo: CategoryRepository) {}

    @Command({ command: 'seed:category', describe: 'seeds categories' })
    async seeds(): Promise<void> {
        const createCategory = () => ({
            id: faker.string.uuid(),
            name: faker.lorem.sentence(),
            description: faker.lorem.paragraphs(),
        });
        try {
            await this.categoryRepo.createMany(
                Array.from({ length: 10 }, createCategory)
            );
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({ command: 'remove:category', describe: 'remove categories' })
    async remove(): Promise<void> {
        try {
            await this.categoryRepo.truncate();
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
