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
import { ConversationEntity } from '../entities/conversation.entity';

@Injectable()
export class ConversationRepository extends CoreRepository<ConversationEntity> {
    constructor(
        @InjectRepository(ConversationEntity)
        private readonly conversationRepo: Repository<ConversationEntity>
    ) {
        super();
    }

    handleSortQuery(
        query: any,
        sorts?: SelectSortQuery<ConversationEntity>[]
    ): void {
        if (sorts) {
            sorts.forEach((sort) => {
                let field = '';
                if (sort.field === 'createdAt') {
                    field = `conversation.createdAt`;
                } else if (sort.field === 'updatedAt') {
                    field = `conversation.updatedAt`;
                }
                if (field) {
                    query.addOrderBy(field, sort.type);
                }
            });
        }
    }

    async findAll(
        filter?: SelectFilterListQuery<ConversationEntity>
    ): Promise<ConversationEntity[]> {
        const query = this.conversationRepo.createQueryBuilder('conversation');
        this.handleSortQuery(query, filter.sorts);
        const list = await query.getMany();
        return list;
    }

    async find(
        filter: SelectFilterPaginationQuery<ConversationEntity>
    ): Promise<ConversationEntity[]> {
        const query = this.conversationRepo.createQueryBuilder('conversation');
        this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const list = await query.getMany();
        return list;
    }

    async findOne(
        _filter: SelectFilterQuery<ConversationEntity>
    ): Promise<ConversationEntity> {
        const query = this.conversationRepo.createQueryBuilder('conversation');
        const result = await query.getOne();
        return result;
    }

    async findAndCount(
        filter: SelectFilterPaginationQuery<ConversationEntity>
    ): Promise<[ConversationEntity[], number]> {
        const query = this.conversationRepo.createQueryBuilder('conversation');
        this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const result = await query.getManyAndCount();
        return result;
    }

    async count(
        _filter: SelectFilterQuery<ConversationEntity>
    ): Promise<number> {
        const query = this.conversationRepo.createQueryBuilder('conversation');
        return await query.getCount();
    }

    async get(
        id: string,
        _relations?: string[] | (keyof ConversationEntity)[]
    ): Promise<ConversationEntity> {
        const query = this.conversationRepo
            .createQueryBuilder('conversation')
            .whereInIds(id);
        const result = await query.getOne();
        return result;
    }

    async create(data: ConversationEntity): Promise<string> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .insert()
            .values(data)
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(
        data: ConversationEntity,
        _relations?: string[] | (keyof ConversationEntity)[]
    ): Promise<ConversationEntity> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .insert()
            .values(data)
            .execute();
        const conversation = await this.get(
            result.identifiers[0].id,
            _relations
        );
        return conversation!;
    }

    async createMultiple(list: ConversationEntity[]): Promise<string[]> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .insert()
            .values(list)
            .execute();
        return result.identifiers.map((identifier) => identifier.id);
    }

    async update(id: string, data: ConversationEntity): Promise<boolean> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .update(data)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(
        id: string,
        data: ConversationEntity,
        _relations?: string[] | (keyof ConversationEntity)[]
    ): Promise<ConversationEntity> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .update(data)
            .whereInIds(id)
            .execute();

        if (!result.affected) {
            return;
        }
        const conversation = await this.get(id, _relations);
        return conversation;
    }

    async updateFields(
        id: string,
        data: ConversationEntity,
        fields: (keyof ConversationEntity)[]
    ): Promise<boolean> {
        const obj = {} as any;
        fields.forEach((field) => {
            obj[field] = data[field as any];
        });

        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .update(obj)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: string): Promise<boolean> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: string[]): Promise<boolean> {
        const result = await this.conversationRepo
            .createQueryBuilder('conversation')
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }
}
