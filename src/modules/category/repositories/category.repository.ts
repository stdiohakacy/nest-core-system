import { DeleteResult, Repository, InsertResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { BaseRepository } from '../../../common/base/repository/base.repository';
import { CategoryEntity } from '../entities/category.entity';
import { ICategoryRepository } from '../interfaces/category.repository.interface';

@Injectable()
export class CategoryRepository
    extends BaseRepository<CategoryEntity>
    implements ICategoryRepository
{
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepo: Repository<CategoryEntity>
    ) {
        super();
    }

    async createMany(categories: any[]): Promise<void> {
        await this.categoryRepo.save(this.categoryRepo.create(categories));
    }

    findOneById(id: string) {
        throw new Error('Method not implemented.');
    }

    findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        throw new Error('Method not implemented.');
    }

    async create(category: CategoryEntity): Promise<InsertResult> {
        return await this.categoryRepo.insert(category);
    }

    update(entity: Partial<CategoryEntity>): Promise<CategoryEntity> {
        throw new Error('Method not implemented.');
    }

    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }

    async truncate(): Promise<DeleteResult> {
        return await this.categoryRepo.delete({});
    }
}
