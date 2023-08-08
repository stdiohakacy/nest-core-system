import { UpdateResult, DeleteResult, InsertResult } from 'typeorm';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { BaseEntity } from '../entity/base.entity';

export abstract class BaseRepository<T> {
    abstract findOneById(id: string);

    abstract findAll(find: Record<string, any>, pagination: PaginationListDTO);

    abstract create(entity: T): Promise<T>;

    abstract update(entity: Partial<T>): Promise<T>;

    abstract delete(id: string): Promise<DeleteResult>;

    abstract truncate(): Promise<DeleteResult>;
}
