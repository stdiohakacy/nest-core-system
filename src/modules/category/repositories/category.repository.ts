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
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends CoreRepository<CategoryEntity> {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>
    ) {
        super();
    }

    handleSortQuery(
        query: any,
        sorts?: SelectSortQuery<CategoryEntity>[]
    ): void {
        if (sorts) {
            sorts.forEach((sort) => {
                let field = '';
                if (sort.field === 'createdAt') {
                    field = `category.createdAt`;
                } else if (sort.field === 'updatedAt') {
                    field = `category.updatedAt`;
                }
                if (field) {
                    query.addOrderBy(field, sort.type);
                }
            });
        }
    }

    async findAll(
        filter?: SelectFilterListQuery<CategoryEntity>
    ): Promise<CategoryEntity[]> {
        const query = this.categoryRepo.createQueryBuilder('category');
        this.handleSortQuery(query, filter.sorts);
        const list = await query.getMany();
        return list;
    }

    async find(
        filter: SelectFilterPaginationQuery<CategoryEntity>
    ): Promise<CategoryEntity[]> {
        const query = this.categoryRepo.createQueryBuilder('category');
        this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const list = await query.getMany();
        return list;
    }

    async findOne(
        _filter: SelectFilterQuery<CategoryEntity>
    ): Promise<CategoryEntity> {
        const query = this.categoryRepo.createQueryBuilder('category');
        const result = await query.getOne();
        return result;
    }

    async findAndCount(
        filter: SelectFilterPaginationQuery<CategoryEntity>
    ): Promise<[CategoryEntity[], number]> {
        const query = this.categoryRepo.createQueryBuilder('category');
        this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const result = await query.getManyAndCount();
        return result;
    }

    async count(_filter: SelectFilterQuery<CategoryEntity>): Promise<number> {
        const query = this.categoryRepo.createQueryBuilder('category');
        return await query.getCount();
    }

    async get(
        id: string,
        _relations?: string[] | (keyof CategoryEntity)[]
    ): Promise<CategoryEntity> {
        const query = this.categoryRepo
            .createQueryBuilder('category')
            .whereInIds(id);
        const result = await query.getOne();
        return result;
    }

    async create(data: CategoryEntity): Promise<string> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .insert()
            .values(data)
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(
        data: CategoryEntity,
        _relations?: string[] | (keyof CategoryEntity)[]
    ): Promise<CategoryEntity> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .insert()
            .values(data)
            .execute();
        const category = await this.get(result.identifiers[0].id, _relations);
        return category!;
    }

    async createMultiple(list: CategoryEntity[]): Promise<string[]> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .insert()
            .values(list)
            .execute();
        return result.identifiers.map((identifier) => identifier.id);
    }

    async update(id: string, data: CategoryEntity): Promise<boolean> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .update(data)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(
        id: string,
        data: CategoryEntity,
        _relations?: string[] | (keyof CategoryEntity)[]
    ): Promise<CategoryEntity> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .update(data)
            .whereInIds(id)
            .execute();

        if (!result.affected) {
            return;
        }
        const category = await this.get(id, _relations);
        return category;
    }

    async updateFields(
        id: string,
        data: CategoryEntity,
        fields: (keyof CategoryEntity)[]
    ): Promise<boolean> {
        const obj = {} as any;
        fields.forEach((field) => {
            obj[field] = data[field as any];
        });

        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .update(obj)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: string): Promise<boolean> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: string[]): Promise<boolean> {
        const result = await this.categoryRepo
            .createQueryBuilder('category')
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }
}
