import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../../../common/pagination/constants/pagination.enum.constant';

export type DbConnection = any;

export type DbQuerySession = any;

export type DbFilterQuery<T> = { [k in Extract<keyof T, string>]?: any } & {
    [key: string]: any;
};

export type SelectRelationQuery<T> = Extract<keyof T, string>;

export type SelectSortQuery<T> = {
    field: Extract<keyof T, string>;
    type: ENUM_PAGINATION_ORDER_DIRECTION_TYPE;
} & { field: string; type: ENUM_PAGINATION_ORDER_DIRECTION_TYPE };

export type SelectFilterQuery<T> = {
    relations?: SelectRelationQuery<T>[] | string[];
};

export type SelectFilterListQuery<T> = SelectFilterQuery<T> & {
    sorts?: SelectSortQuery<T>[];
};

export type SelectFilterPaginationQuery<T> = SelectFilterListQuery<T> & {
    skip: number;
    limit: number;
    conditionals?: Record<string, any>[];
};

export type UpdateFieldQuery<T> = Extract<keyof T, string>;

export abstract class CoreRepository<T> {
    abstract handleSortQuery(query, sorts?: SelectSortQuery<T>[]): void;

    abstract findAll(filter: SelectFilterListQuery<T>): Promise<T[]>;

    abstract find(filter: SelectFilterPaginationQuery<T>): Promise<T[]>;

    abstract findOne(_filter: SelectFilterQuery<T>): Promise<T | undefined>;

    abstract findAndCount(
        filter: SelectFilterPaginationQuery<T>
    ): Promise<[T[], number]>;

    abstract count(_filter: SelectFilterQuery<T>): Promise<number>;

    abstract get(
        id: string,
        _relations?: SelectRelationQuery<T>[] | string[],
        querySession?: DbQuerySession
    ): Promise<T | undefined>;

    abstract create(data: T): Promise<string>;

    abstract createGet(
        data: T,
        _relations?: SelectRelationQuery<T>[] | string[]
    ): Promise<T>;

    abstract createMultiple(list: T[]): Promise<string[]>;

    abstract update(id: string, data: T): Promise<boolean>;

    abstract updateGet(
        id: string,
        data: T,
        _relations?: SelectRelationQuery<T>[] | string[]
    ): Promise<T | undefined>;

    abstract updateFields(
        id: string,
        data: T,
        fields: UpdateFieldQuery<T>[]
    ): Promise<boolean>;

    abstract delete(id: string): Promise<boolean>;

    abstract deleteMultiple(ids: string[]): Promise<boolean>;

    abstract softDelete(id: string): Promise<boolean>;

    abstract softDeleteMultiple(ids: string[]): Promise<boolean>;

    abstract restore(id: string): Promise<boolean>;

    abstract restoreMultiple(ids: string[]): Promise<boolean>;
}
