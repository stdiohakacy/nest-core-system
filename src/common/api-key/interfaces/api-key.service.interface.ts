import { ApiKeyEntity } from '../../../modules/api-key/entities/api-key.entity';
import { UpdateResult } from 'typeorm';
import {
    ApiKeyCreateDTO,
    ApiKeyCreateRawDTO,
} from '../dtos/api-key.create.dto';
import { IApiKeyCreated } from './api-key.interface';
import { ApiKeyUpdateDTO } from '../dtos/api-key.update.dto';
import { ApiKeyUpdateDateDTO } from '../dtos/api-key.update-date.dto';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';

export interface IApiKeyService {
    findAll(find?: Record<string, any>): Promise<ApiKeyEntity[]>;
    findOneById(id: string): Promise<ApiKeyEntity>;
    findOne(find: Record<string, any>): Promise<ApiKeyEntity>;
    findOneByKey(key: string): Promise<ApiKeyEntity>;
    findOneByActiveKey(key: string): Promise<ApiKeyEntity>;
    getTotal(find?: Record<string, any>): Promise<number>;
    create({
        name,
        startDate,
        endDate,
    }: ApiKeyCreateDTO): Promise<IApiKeyCreated>;
    createRaw({
        name,
        key,
        secret,
        startDate,
        endDate,
    }: ApiKeyCreateRawDTO): Promise<IApiKeyCreated>;
    active(repository: ApiKeyEntity): Promise<ApiKeyEntity>;
    inactive(repository: ApiKeyEntity): Promise<ApiKeyEntity>;
    update(
        repository: ApiKeyEntity,
        { name }: ApiKeyUpdateDTO
    ): Promise<ApiKeyEntity>;
    updateDate(
        repository: ApiKeyEntity,
        { startDate, endDate }: ApiKeyUpdateDateDTO
    ): Promise<ApiKeyEntity>;
    reset(repository: ApiKeyEntity, secret: string): Promise<ApiKeyEntity>;
    delete(repository: ApiKeyEntity): Promise<UpdateResult>;
    validateHashApiKey(hashFromRequest: string, hash: string): Promise<boolean>;
    createKey(): Promise<string>;
    createSecret(): Promise<string>;
    createHashApiKey(key: string, secret: string): Promise<string>;
    deleteMany(find: Record<string, any>): Promise<UpdateResult>;
    inactiveManyByEndDate(): Promise<UpdateResult>;
    findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ): Promise<[ApiKeyEntity[], number]>;
}
