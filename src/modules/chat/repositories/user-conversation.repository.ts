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
import { UserConversationEntity } from '../entities/user-conversation.entity';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

@Injectable()
export class UserConversationRepository extends CoreRepository<UserConversationEntity> {
    constructor(
        @InjectRepository(UserConversationEntity)
        private readonly userConversationRepo: Repository<UserConversationEntity>
    ) {
        super();
    }

    handleSortQuery(
        query: any,
        sorts?: SelectSortQuery<UserConversationEntity>[]
    ): void {
        if (sorts) {
            sorts.forEach((sort) => {
                let field = '';
                if (sort.field === 'createdAt') {
                    field = `userConversation.createdAt`;
                } else if (sort.field === 'updatedAt') {
                    field = `userConversation.updatedAt`;
                }
                if (field) {
                    query.addOrderBy(field, sort.type);
                }
            });
        }
    }

    async findAll(
        filter?: SelectFilterListQuery<UserConversationEntity>
    ): Promise<UserConversationEntity[]> {
        const query =
            this.userConversationRepo.createQueryBuilder('userConversation');
        // this.handleSortQuery(query, filter.sorts);
        const list = await query.getMany();
        return list;
    }

    async find(
        filter: SelectFilterPaginationQuery<UserConversationEntity>
    ): Promise<UserConversationEntity[]> {
        const query =
            this.userConversationRepo.createQueryBuilder('userConversation');
        // this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const list = await query.getMany();
        return list;
    }

    async findOne(
        _filter: SelectFilterQuery<UserConversationEntity>
    ): Promise<UserConversationEntity> {
        const query =
            this.userConversationRepo.createQueryBuilder('userConversation');
        const result = await query.getOne();
        return result;
    }

    async findAndCount(
        filter: SelectFilterPaginationQuery<UserConversationEntity>
    ): Promise<[UserConversationEntity[], number]> {
        const query =
            this.userConversationRepo.createQueryBuilder('userConversation');
        // this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        query.orderBy(
            'userConversation.createdAt',
            ENUM_PAGINATION_ORDER_DIRECTION_TYPE.ASC
        );
        if (filter?.conditionals?.length) {
            filter.conditionals.forEach((conditional) => {
                const columnName = Object.keys(conditional)[0];
                const parameterName = conditional[columnName];
                const objParameter = {};
                objParameter[`${columnName}`] = parameterName;
                query.andWhere(
                    `"userConversation"."${columnName}" = :${columnName}`,
                    objParameter
                );
            });
        }

        const result = await query.getManyAndCount();
        return result;
    }

    async count(
        _filter: SelectFilterQuery<UserConversationEntity>
    ): Promise<number> {
        const query =
            this.userConversationRepo.createQueryBuilder('userConversation');
        return await query.getCount();
    }

    async get(
        id: string,
        _relations?: string[] | (keyof UserConversationEntity)[]
    ): Promise<UserConversationEntity> {
        const query = this.userConversationRepo
            .createQueryBuilder('userConversation')
            .whereInIds(id);
        const result = await query.getOne();
        return result;
    }

    async create(data: UserConversationEntity): Promise<string> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .insert()
            .values(data)
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(
        data: UserConversationEntity,
        _relations?: string[] | (keyof UserConversationEntity)[]
    ): Promise<UserConversationEntity> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .insert()
            .values(data)
            .execute();
        const userConversation = await this.get(
            result.identifiers[0].id,
            _relations
        );
        return userConversation!;
    }

    async createMultiple(list: UserConversationEntity[]): Promise<string[]> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .insert()
            .values(list)
            .execute();
        return result.identifiers.map((identifier) => identifier.id);
    }

    async update(id: string, data: UserConversationEntity): Promise<boolean> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .update(data)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(
        id: string,
        data: UserConversationEntity,
        _relations?: string[] | (keyof UserConversationEntity)[]
    ): Promise<UserConversationEntity> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .update(data)
            .whereInIds(id)
            .execute();

        if (!result.affected) {
            return;
        }
        const userConversation = await this.get(id, _relations);
        return userConversation;
    }

    async updateFields(
        id: string,
        data: UserConversationEntity,
        fields: (keyof UserConversationEntity)[]
    ): Promise<boolean> {
        const obj = {} as any;
        fields.forEach((field) => {
            obj[field] = data[field as any];
        });

        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .update(obj)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: string): Promise<boolean> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: string[]): Promise<boolean> {
        const result = await this.userConversationRepo
            .createQueryBuilder('userConversation')
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }
}
