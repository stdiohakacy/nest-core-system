import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {
    CoreRepository,
    SelectFilterListQuery,
    SelectFilterPaginationQuery,
    SelectFilterQuery,
    SelectSortQuery,
} from '../../../common/base/repository/core.repository';
import { AccessTokenEntity } from '../entities/access-token.entity';
import { IAccessTokenRepository } from '../interfaces/access-token.repository.interface';
import { ENUM_ACCESS_TOKEN_STATUS } from '../constants/access-token.enum.constant';

@Injectable()
export class AccessTokenRepository
    extends CoreRepository<AccessTokenEntity>
    implements IAccessTokenRepository
{
    constructor(
        @InjectRepository(AccessTokenEntity)
        private readonly accessTokenRepo: Repository<AccessTokenEntity>
    ) {
        super();
    }

    async revokeByUserId(
        userId: string,
        updatedBy?: string
    ): Promise<UpdateResult> {
        return await this.accessTokenRepo.update(
            { userId },
            {
                status: ENUM_ACCESS_TOKEN_STATUS.REVOKE,
                updatedBy,
            }
        );
    }

    async revokeByToken(token: string): Promise<UpdateResult> {
        return await this.accessTokenRepo.update(
            { token },
            { status: ENUM_ACCESS_TOKEN_STATUS.REVOKE }
        );
    }

    async isTokenRevoke(token: string): Promise<boolean> {
        // const isValid = await this.accessTokenRepo.exist({
        //     where: { token, status: ENUM_ACCESS_TOKEN_STATUS.ACTIVE },
        // });
        // return isValid;
        return true;
    }

    async getByToken(token: string): Promise<AccessTokenEntity> {
        return await this.accessTokenRepo.findOneBy({ token });
    }

    handleSortQuery(
        query: any,
        sorts?: SelectSortQuery<AccessTokenEntity>[]
    ): void {
        if (sorts) {
            sorts.forEach((sort) => {
                let field = '';
                if (sort.field === 'createdAt') {
                    field = `accessToken.createdAt`;
                } else if (sort.field === 'updatedAt') {
                    field = `accessToken.updatedAt`;
                }
                if (field) {
                    query.addOrderBy(field, sort.type);
                }
            });
        }
    }

    async findAll(
        filter: SelectFilterListQuery<AccessTokenEntity>
    ): Promise<AccessTokenEntity[]> {
        const query = this.accessTokenRepo.createQueryBuilder('accessToken');
        // this.handleSortQuery(query, filter.sorts);
        const list = await query.getMany();
        return list;
    }

    async find(
        filter: SelectFilterPaginationQuery<AccessTokenEntity>
    ): Promise<AccessTokenEntity[]> {
        const query = this.accessTokenRepo.createQueryBuilder('accessToken');
        // this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const list = await query.getMany();
        return list;
    }

    async findOne(
        _filter: SelectFilterQuery<AccessTokenEntity>
    ): Promise<AccessTokenEntity> {
        const query = this.accessTokenRepo.createQueryBuilder('accessToken');
        const result = await query.getOne();
        return result;
    }

    async findAndCount(
        filter: SelectFilterPaginationQuery<AccessTokenEntity>
    ): Promise<[AccessTokenEntity[], number]> {
        const query = this.accessTokenRepo.createQueryBuilder('accessToken');
        // this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const result = await query.getManyAndCount();
        return result;
    }

    async count(
        _filter: SelectFilterQuery<AccessTokenEntity>
    ): Promise<number> {
        const query = this.accessTokenRepo.createQueryBuilder('accessToken');
        return await query.getCount();
    }

    async get(
        id: string,
        _relations?: string[] | (keyof AccessTokenEntity)[]
    ): Promise<AccessTokenEntity> {
        const query = this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .whereInIds(id);
        const result = await query.getOne();
        return result;
    }

    async create(data: AccessTokenEntity): Promise<string> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .insert()
            .values(data)
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(
        data: AccessTokenEntity,
        _relations?: string[] | (keyof AccessTokenEntity)[]
    ): Promise<AccessTokenEntity> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .insert()
            .values(data)
            .execute();
        const accessToken = await this.get(
            result.identifiers[0].id,
            _relations
        );
        return accessToken!;
    }

    async createMultiple(list: AccessTokenEntity[]): Promise<string[]> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .insert()
            .values(list)
            .execute();
        return result.identifiers.map((identifier) => identifier.id);
    }

    async update(id: string, data: AccessTokenEntity): Promise<boolean> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .update(data)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(
        id: string,
        data: AccessTokenEntity,
        _relations?: string[] | (keyof AccessTokenEntity)[]
    ): Promise<AccessTokenEntity> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .update(data)
            .whereInIds(id)
            .execute();

        if (!result.affected) {
            return;
        }
        const accessToken = await this.get(id, _relations);
        return accessToken;
    }

    async updateFields(
        id: string,
        data: AccessTokenEntity,
        fields: (keyof AccessTokenEntity)[]
    ): Promise<boolean> {
        const obj = {} as any;
        fields.forEach((field) => {
            obj[field] = data[field as any];
        });

        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .update(obj)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: string): Promise<boolean> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: string[]): Promise<boolean> {
        const result = await this.accessTokenRepo
            .createQueryBuilder('accessToken')
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }
}
