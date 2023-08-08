import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ProductRepository } from '../../modules/product/repositories/product.repository';

@Injectable()
export class MigrationProductSeed {
    constructor(private readonly productRepo: ProductRepository) {}

    @Command({ command: 'seed:product', describe: 'seeds products' })
    async seeds(): Promise<void> {
        const createProduct = () => ({
            id: faker.string.uuid(),
            name: faker.lorem.sentence(),
            inStock: true,
            price: faker.number.int({ min: 1000, max: 100000 }),
            description: faker.lorem.paragraphs(),
        });
        try {
            await this.productRepo.createMany(
                Array.from({ length: 10 }, createProduct)
            );
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({ command: 'remove:product', describe: 'remove products' })
    async remove(): Promise<void> {
        try {
            await this.productRepo.truncate();
        } catch (err: any) {
            throw new Error(err.message);
        }
        return;
    }
}
