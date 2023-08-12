import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { SmsEntity } from '../entities/sms.entity';
import {
    CoreRepository,
    SelectFilterListQuery,
    SelectFilterPaginationQuery,
    SelectFilterQuery,
    SelectSortQuery,
} from '../../../common/base/repository/core.repository';

@Injectable()
export class SmsRepository extends CoreRepository<SmsEntity> {
    constructor(
        @InjectRepository(SmsEntity)
        private readonly smsRepo: Repository<SmsEntity>
    ) {
        super();
    }

    handleSortQuery(query: any, sorts?: SelectSortQuery<SmsEntity>[]): void {
        if (sorts) {
            sorts.forEach((sort) => {
                let field = '';
                if (sort.field === 'createdAt') {
                    field = `sms.createdAt`;
                } else if (sort.field === 'updatedAt') {
                    field = `sms.updatedAt`;
                }
                if (field) {
                    query.addOrderBy(field, sort.type);
                }
            });
        }
    }

    async findAll(
        filter: SelectFilterListQuery<SmsEntity>
    ): Promise<SmsEntity[]> {
        const query = this.smsRepo.createQueryBuilder('sms');
        this.handleSortQuery(query, filter.sorts);
        const list = await query.getMany();
        return list;
    }

    async find(
        filter: SelectFilterPaginationQuery<SmsEntity>
    ): Promise<SmsEntity[]> {
        const query = this.smsRepo.createQueryBuilder('sms');
        this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const list = await query.getMany();
        return list;
    }

    async findOne(_filter: SelectFilterQuery<SmsEntity>): Promise<SmsEntity> {
        const query = this.smsRepo.createQueryBuilder('sms');
        const result = await query.getOne();
        return result;
    }

    async findAndCount(
        filter: SelectFilterPaginationQuery<SmsEntity>
    ): Promise<[SmsEntity[], number]> {
        const query = this.smsRepo.createQueryBuilder('sms');
        this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const result = await query.getManyAndCount();
        return result;
    }

    async count(_filter: SelectFilterQuery<SmsEntity>): Promise<number> {
        const query = this.smsRepo.createQueryBuilder('sms');
        return await query.getCount();
    }

    async get(
        id: string,
        _relations?: string[] | (keyof SmsEntity)[]
    ): Promise<SmsEntity> {
        const query = this.smsRepo.createQueryBuilder('sms').whereInIds(id);
        const result = await query.getOne();
        return result;
    }

    async create(data: SmsEntity): Promise<string> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .insert()
            .values(data)
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(
        data: SmsEntity,
        _relations?: string[] | (keyof SmsEntity)[]
    ): Promise<SmsEntity> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .insert()
            .values(data)
            .execute();
        const sms = await this.get(result.identifiers[0].id, _relations);
        return sms!;
    }

    async createMultiple(list: SmsEntity[]): Promise<string[]> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .insert()
            .values(list)
            .execute();
        return result.identifiers.map((identifier) => identifier.id);
    }

    async update(id: string, data: SmsEntity): Promise<boolean> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .update(data)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(
        id: string,
        data: SmsEntity,
        _relations?: string[] | (keyof SmsEntity)[]
    ): Promise<SmsEntity> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .update(data)
            .whereInIds(id)
            .execute();

        if (!result.affected) {
            return;
        }
        const sms = await this.get(id, _relations);
        return sms;
    }

    async updateFields(
        id: string,
        data: SmsEntity,
        fields: (keyof SmsEntity)[]
    ): Promise<boolean> {
        const obj = {} as any;
        fields.forEach((field) => {
            obj[field] = data[field as any];
        });

        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .update(obj)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: string): Promise<boolean> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: string[]): Promise<boolean> {
        const result = await this.smsRepo
            .createQueryBuilder('sms')
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }
}
