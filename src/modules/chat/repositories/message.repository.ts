import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { MessageEntity } from '../entities/message.entity';
import {
    CoreRepository,
    SelectFilterListQuery,
    SelectFilterPaginationQuery,
    SelectFilterQuery,
    SelectSortQuery,
} from '../../../common/base/repository/core.repository';
import { IMessageRepository } from '../interfaces/message.repository.interface';

@Injectable()
export class MessageRepository
    extends CoreRepository<MessageEntity>
    implements IMessageRepository
{
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepo: Repository<MessageEntity>
    ) {
        super();
    }

    // async getByConversation(conversationId: string): Promise<MessageEntity[]> {
    //     const messages = await this.messageRepo
    //         .createQueryBuilder('message')
    //         .where('message.conversationId = :conversationId', {
    //             conversationId,
    //         })
    //         .getMany();
    //     return messages;
    // }

    async getByConversation(
        filter: SelectFilterPaginationQuery<MessageEntity>,
        conversationId: string
    ): Promise<[MessageEntity[], number]> {
        const query = this.messageRepo.createQueryBuilder('message');
        this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        query.where('message.conversationId = :conversationId', {
            conversationId,
        });
        const result = await query.getManyAndCount();
        return result;
    }

    handleSortQuery(
        query: any,
        sorts?: SelectSortQuery<MessageEntity>[]
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
        filter: SelectFilterListQuery<MessageEntity>
    ): Promise<MessageEntity[]> {
        const query = this.messageRepo.createQueryBuilder('message');
        this.handleSortQuery(query, filter.sorts);
        const list = await query.getMany();
        return list;
    }

    async find(
        filter: SelectFilterPaginationQuery<MessageEntity>
    ): Promise<MessageEntity[]> {
        const query = this.messageRepo.createQueryBuilder('message');
        this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const list = await query.getMany();
        return list;
    }

    async findOne(
        _filter: SelectFilterQuery<MessageEntity>
    ): Promise<MessageEntity> {
        const query = this.messageRepo.createQueryBuilder('message');
        const result = await query.getOne();
        return result;
    }

    async findAndCount(
        filter: SelectFilterPaginationQuery<MessageEntity>
    ): Promise<[MessageEntity[], number]> {
        const query = this.messageRepo.createQueryBuilder('message');
        this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const result = await query.getManyAndCount();
        return result;
    }

    async count(_filter: SelectFilterQuery<MessageEntity>): Promise<number> {
        const query = this.messageRepo.createQueryBuilder('message');
        return await query.getCount();
    }

    async get(
        id: string,
        _relations?: string[] | (keyof MessageEntity)[]
    ): Promise<MessageEntity> {
        const query = this.messageRepo
            .createQueryBuilder('message')
            .whereInIds(id);
        const result = await query.getOne();
        return result;
    }

    async create(data: MessageEntity): Promise<string> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .insert()
            .values(data)
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(
        data: MessageEntity,
        _relations?: string[] | (keyof MessageEntity)[]
    ): Promise<MessageEntity> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .insert()
            .values(data)
            .execute();
        const product = await this.get(result.identifiers[0].id, _relations);
        return product!;
    }

    async createMultiple(list: MessageEntity[]): Promise<string[]> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .insert()
            .values(list)
            .execute();
        return result.identifiers.map((identifier) => identifier.id);
    }

    async update(id: string, data: MessageEntity): Promise<boolean> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .update(data)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(
        id: string,
        data: MessageEntity,
        _relations?: string[] | (keyof MessageEntity)[]
    ): Promise<MessageEntity> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
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
        data: MessageEntity,
        fields: (keyof MessageEntity)[]
    ): Promise<boolean> {
        const obj = {} as any;
        fields.forEach((field) => {
            obj[field] = data[field as any];
        });

        const result = await this.messageRepo
            .createQueryBuilder('message')
            .update(obj)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: string): Promise<boolean> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: string[]): Promise<boolean> {
        const result = await this.messageRepo
            .createQueryBuilder('message')
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }
}
