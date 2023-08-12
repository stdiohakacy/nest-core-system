import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../modules/category/repositories/category.repository';
import { faker } from '@faker-js/faker';
import { CategoryEntity } from '../../modules/category/entities/category.entity';

@Injectable()
export class MigrationCategorySeed {
    constructor(private readonly categoryRepo: CategoryRepository) {}

    @Command({ command: 'seed:category', describe: 'seeds categories' })
    async seeds(): Promise<void> {
        try {
            const categories = Array.from({ length: 10 }).map(() => {
                const category = new CategoryEntity();
                category.id = faker.string.uuid();
                category.name = faker.lorem.sentence();
                category.description = faker.lorem.paragraphs();
                return category;
            });

            await this.categoryRepo.createMultiple(categories);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    @Command({ command: 'remove:category', describe: 'remove categories' })
    async remove(): Promise<void> {
        try {
            const categoryIds = (await this.categoryRepo.findAll()).map(
                (category) => category.id
            );
            await this.categoryRepo.deleteMultiple(categoryIds);
        } catch (err: any) {
            throw new Error(err.message);
        }
    }
}
