import { Injectable } from '@nestjs/common';
import { IApiKeyService } from 'src/common/api-key/interfaces/api-key.service.interface';
import { IApiKeyCreated } from 'src/common/api-key/interfaces/api-key.interface';
import { ApiKeyActiveDto } from 'src/common/api-key/dtos/api-key.active.dto';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { ConfigService } from '@nestjs/config';
import { HelperHashService } from 'src/common/helper/services/helper.hash.service';
import {
    ApiKeyCreateDTO,
    ApiKeyCreateRawDTO,
} from 'src/common/api-key/dtos/api-key.create.dto';
import { ApiKeyUpdateDTO } from 'src/common/api-key/dtos/api-key.update.dto';
import { ApiKeyUpdateDateDTO } from 'src/common/api-key/dtos/api-key.update-date.dto';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKeyEntity } from 'src/modules/api-key/entities/api-key.entity';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationListDTO } from 'src/common/pagination/dtos/pagination.list.dto';

@Injectable()
export class ApiKeyService implements IApiKeyService {
    private readonly env: string;

    constructor(
        @InjectRepository(ApiKeyEntity)
        private readonly apiKeyRepo: Repository<ApiKeyEntity>,
        private readonly helperStringService: HelperStringService,
        private readonly configService: ConfigService,
        private readonly helperHashService: HelperHashService,
        private readonly helperDateService: HelperDateService
    ) {
        this.env = this.configService.get<string>('app.env');
    }

    async findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ): Promise<[ApiKeyEntity[], number]> {
        const { _limit, _offset, _order } = pagination;
        return await this.apiKeyRepo.findAndCount({
            where: find,
            take: _limit,
            skip: _offset,
            order: _order,
        });
    }

    async findAll(find?: Record<string, any>): Promise<ApiKeyEntity[]> {
        return await this.apiKeyRepo.find(find);
    }

    async findOneById(id: string): Promise<ApiKeyEntity> {
        return await this.apiKeyRepo.findOneBy({ id });
    }

    async findOne(find: Record<string, any>): Promise<ApiKeyEntity> {
        return await this.apiKeyRepo.findOne({ where: find });
    }

    async findOneByKey(key: string): Promise<ApiKeyEntity> {
        return await this.apiKeyRepo.findOneBy({ key });
    }

    async findOneByActiveKey(key: string): Promise<ApiKeyEntity> {
        return await this.apiKeyRepo.findOneBy({ key, isActive: true });
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return await this.apiKeyRepo.count(find);
    }

    async create({
        name,
        type,
        startDate,
        endDate,
    }: ApiKeyCreateDTO): Promise<IApiKeyCreated> {
        const key = await this.createKey();
        const secret = await this.createSecret();
        const hash: string = await this.createHashApiKey(key, secret);

        const dto: ApiKeyEntity = new ApiKeyEntity();
        dto.name = name;
        dto.key = key;
        dto.hash = hash;
        dto.isActive = true;
        dto.type = type;

        if (startDate && endDate) {
            dto.startDate = this.helperDateService.startOfDay(startDate);
            dto.endDate = this.helperDateService.endOfDay(endDate);
        }

        const created: ApiKeyEntity = await this.apiKeyRepo.save(dto);
        return { doc: created, secret };
    }

    async createRaw({
        name,
        key,
        type,
        secret,
        startDate,
        endDate,
    }: ApiKeyCreateRawDTO): Promise<IApiKeyCreated> {
        const hash: string = await this.createHashApiKey(key, secret);

        const dto: ApiKeyEntity = new ApiKeyEntity();
        dto.name = name;
        dto.key = key;
        dto.hash = hash;
        dto.isActive = true;
        dto.type = type;

        if (startDate && endDate) {
            dto.startDate = this.helperDateService.startOfDay(startDate);
            dto.endDate = this.helperDateService.endOfDay(endDate);
        }

        const created: ApiKeyEntity = await this.apiKeyRepo.save<ApiKeyEntity>(
            dto
        );

        return { doc: created, secret };
    }

    async active(apiKey: ApiKeyEntity): Promise<ApiKeyEntity> {
        apiKey.isActive = true;
        return await this.apiKeyRepo.save(apiKey);
    }

    async inactive(apiKey: ApiKeyEntity): Promise<ApiKeyEntity> {
        apiKey.isActive = false;

        return this.apiKeyRepo.save(apiKey);
    }

    async update(
        apiKey: ApiKeyEntity,
        { name }: ApiKeyUpdateDTO
    ): Promise<ApiKeyEntity> {
        apiKey.name = name;
        return await this.apiKeyRepo.save(apiKey);
    }

    async updateDate(
        apiKey: ApiKeyEntity,
        { startDate, endDate }: ApiKeyUpdateDateDTO
    ): Promise<ApiKeyEntity> {
        apiKey.startDate = this.helperDateService.startOfDay(startDate);
        apiKey.endDate = this.helperDateService.endOfDay(endDate);

        return this.apiKeyRepo.save(apiKey);
    }

    async reset(apiKey: ApiKeyEntity, secret: string): Promise<ApiKeyEntity> {
        const hash: string = await this.createHashApiKey(apiKey.key, secret);
        apiKey.hash = hash;
        return this.apiKeyRepo.save(apiKey);
    }

    async delete(apiKey: ApiKeyEntity): Promise<UpdateResult> {
        return this.apiKeyRepo.softDelete(apiKey.id);
    }

    async validateHashApiKey(
        hashFromRequest: string,
        hash: string
    ): Promise<boolean> {
        return this.helperHashService.sha256Compare(hashFromRequest, hash);
    }

    async createKey(): Promise<string> {
        return this.helperStringService.random(25, {
            safe: false,
            upperCase: true,
            prefix: `${this.env}_`,
        });
    }

    async createSecret(): Promise<string> {
        return this.helperStringService.random(35, {
            safe: false,
            upperCase: true,
        });
    }

    async createHashApiKey(key: string, secret: string): Promise<string> {
        return this.helperHashService.sha256(`${key}:${secret}`);
    }

    async deleteMany(find: Record<string, any>): Promise<UpdateResult> {
        return await this.apiKeyRepo.softDelete(find);
    }

    async inactiveManyByEndDate(): Promise<UpdateResult> {
        return await this.apiKeyRepo
            .createQueryBuilder()
            .update(ApiKeyEntity)
            .set({ isActive: false })
            .where('endDate <= :currentDate', {
                currentDate: this.helperDateService.create(),
            })
            .andWhere('isActive = :isActive', { isActive: true })
            .execute();
    }
}
