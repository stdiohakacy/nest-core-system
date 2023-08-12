import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ProductRepository } from '../../modules/product/repositories/product.repository';
import { ProductEntity } from '../../modules/product/entities/product.entity';

@Injectable()
export class MigrationProductSeed {
    constructor(private readonly productRepo: ProductRepository) {}

    @Command({ command: 'seed:product', describe: 'seeds products' })
    async seeds(): Promise<void> {
        const products = Array.from({ length: 10 }).map(() => {
            const product = new ProductEntity();
            product.id = faker.string.uuid();
            product.name = faker.lorem.sentence();
            product.inStock = true;
            product.price = faker.number.int({ min: 1000, max: 100000 });
            product.description = faker.lorem.paragraphs();

            return product;
        });

        try {
            await this.productRepo.createMultiple(products);
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({ command: 'remove:product', describe: 'remove products' })
    async remove(): Promise<void> {
        try {
            const productIds = (await this.productRepo.findAll()).map(
                (product) => product.id
            );
            await this.productRepo.deleteMultiple(productIds);
        } catch (err: any) {
            throw new Error(err.message);
        }
        return;
    }
}
