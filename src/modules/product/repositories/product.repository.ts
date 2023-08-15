import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {
    CoreRepository,
    SelectFilterListQuery,
    SelectFilterPaginationQuery,
    SelectFilterQuery,
    SelectSortQuery,
} from '../../../common/base/repository/core.repository';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends CoreRepository<ProductEntity> {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>
    ) {
        super();
    }

    handleSortQuery(
        query: any,
        sorts?: SelectSortQuery<ProductEntity>[]
    ): void {
        if (sorts) {
            sorts.forEach((sort) => {
                let field = '';
                if (sort.field === 'createdAt') {
                    field = `product.createdAt`;
                } else if (sort.field === 'updatedAt') {
                    field = `product.updatedAt`;
                }
                if (field) {
                    query.addOrderBy(field, sort.type);
                }
            });
        }
    }

    async findAll(
        filter?: SelectFilterListQuery<ProductEntity>
    ): Promise<ProductEntity[]> {
        const query = this.productRepo.createQueryBuilder('product');
        // this.handleSortQuery(query, filter.sorts);
        const list = await query.getMany();
        return list;
    }

    async find(
        filter: SelectFilterPaginationQuery<ProductEntity>
    ): Promise<ProductEntity[]> {
        const query = this.productRepo.createQueryBuilder('product');
        // this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const list = await query.getMany();
        return list;
    }

    async findOne(
        _filter: SelectFilterQuery<ProductEntity>
    ): Promise<ProductEntity> {
        const query = this.productRepo.createQueryBuilder('product');
        const result = await query.getOne();
        return result;
    }

    async findAndCount(
        filter: SelectFilterPaginationQuery<ProductEntity>
    ): Promise<[ProductEntity[], number]> {
        const query = this.productRepo.createQueryBuilder('product');
        // this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const result = await query.getManyAndCount();
        return result;
    }

    async count(_filter: SelectFilterQuery<ProductEntity>): Promise<number> {
        const query = this.productRepo.createQueryBuilder('product');
        return await query.getCount();
    }

    async get(
        id: string,
        _relations?: string[] | (keyof ProductEntity)[]
    ): Promise<ProductEntity> {
        const query = this.productRepo
            .createQueryBuilder('product')
            .whereInIds(id);
        const result = await query.getOne();
        return result;
    }

    async create(data: ProductEntity): Promise<string> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .insert()
            .values(data)
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(
        data: ProductEntity,
        _relations?: string[] | (keyof ProductEntity)[]
    ): Promise<ProductEntity> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .insert()
            .values(data)
            .execute();
        const product = await this.get(result.identifiers[0].id, _relations);
        return product!;
    }

    async createMultiple(list: ProductEntity[]): Promise<string[]> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .insert()
            .values(list)
            .execute();
        return result.identifiers.map((identifier) => identifier.id);
    }

    async update(id: string, data: ProductEntity): Promise<boolean> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .update(data)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(
        id: string,
        data: ProductEntity,
        _relations?: string[] | (keyof ProductEntity)[]
    ): Promise<ProductEntity> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .update(data)
            .whereInIds(id)
            .execute();

        if (!result.affected) {
            return;
        }
        const product = await this.get(id, _relations);
        return product;
    }

    async updateFields(
        id: string,
        data: ProductEntity,
        fields: (keyof ProductEntity)[]
    ): Promise<boolean> {
        const obj = {} as any;
        fields.forEach((field) => {
            obj[field] = data[field as any];
        });

        const result = await this.productRepo
            .createQueryBuilder('product')
            .update(obj)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: string): Promise<boolean> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: string[]): Promise<boolean> {
        const result = await this.productRepo
            .createQueryBuilder('product')
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }
}
