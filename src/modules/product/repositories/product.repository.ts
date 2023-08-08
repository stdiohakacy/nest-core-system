import { DeleteResult, Repository, InsertResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { BaseRepository } from '../../../common/base/repository/base.repository';
import { ProductEntity } from '../entities/product.entity';
import { IProductRepository } from '../interfaces/product.repository.interface';

@Injectable()
//
export class ProductRepository
    extends BaseRepository<ProductEntity>
    implements IProductRepository
{
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>
    ) {
        super();
    }

    async createMany(products: any[]): Promise<void> {
        await this.productRepo.save(this.productRepo.create(products));
    }

    findOneById(id: string) {
        throw new Error('Method not implemented.');
    }

    findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        throw new Error('Method not implemented.');
    }

    async create(product: ProductEntity): Promise<ProductEntity> {
        return await this.productRepo.save(product);
    }

    update(entity: Partial<ProductEntity>): Promise<ProductEntity> {
        throw new Error('Method not implemented.');
    }

    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }

    async truncate(): Promise<DeleteResult> {
        return await this.productRepo.delete({});
    }
}
