import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { UserEntity } from '../entities/user.entity';
import {
    CoreRepository,
    SelectFilterListQuery,
    SelectFilterPaginationQuery,
    SelectFilterQuery,
    SelectSortQuery,
} from '../../../common/base/repository/core.repository';
import { IUserRepository } from '../interfaces/user.repository.interface';

@Injectable()
export class UserRepository
    extends CoreRepository<UserEntity>
    implements IUserRepository
{
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
    ) {
        super();
    }

    async findOneById(id: string): Promise<UserEntity> {
        return await this.userRepo.findOne({ where: { id } });
    }

    async findOneByUsername(username: string): Promise<UserEntity> {
        return await this.userRepo.findOne({ where: { username } });
    }

    async findOneByEmail(email: string): Promise<UserEntity> {
        return await this.userRepo.findOne({ where: { email } });
    }

    async findAll(
        filter?: SelectFilterListQuery<UserEntity>
    ): Promise<UserEntity[]> {
        const query = this.userRepo.createQueryBuilder('user');
        // this.handleSortQuery(query, filter?.sorts);
        const list = await query.getMany();
        return list;
    }

    async find(
        filter: SelectFilterPaginationQuery<UserEntity>
    ): Promise<UserEntity[]> {
        const query = this.userRepo.createQueryBuilder('user');
        // this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const list = await query.getMany();
        return list;
    }

    async findOne(_filter: SelectFilterQuery<UserEntity>): Promise<UserEntity> {
        const query = this.userRepo.createQueryBuilder('user');
        const result = await query.getOne();
        return result;
    }

    async findAndCount(
        filter: SelectFilterPaginationQuery<UserEntity>
    ): Promise<[UserEntity[], number]> {
        const query = this.userRepo.createQueryBuilder('user');
        // this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);

        if (filter?.conditionals?.length) {
            filter.conditionals.forEach((conditional) => {
                const columnName = Object.keys(conditional)[0];
                const parameterName = conditional[columnName];
                const objParameter = {};
                objParameter[`${columnName}`] = parameterName;
                query.andWhere(
                    `"user"."${columnName}" = :${columnName}`,
                    objParameter
                );
            });
        }

        const [result, count] = await query.getManyAndCount();
        return [result, count];
    }

    async count(_filter: SelectFilterQuery<UserEntity>): Promise<number> {
        const query = this.userRepo.createQueryBuilder('user');
        return await query.getCount();
    }

    async get(
        id: string,
        _relations?: string[] | (keyof UserEntity)[]
    ): Promise<UserEntity> {
        const query = this.userRepo.createQueryBuilder('user').whereInIds(id);
        const result = await query.getOne();
        return result;
    }

    async create(data: UserEntity): Promise<string> {
        const result = await this.userRepo
            .createQueryBuilder('user')
            .insert()
            .values(data)
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(
        data: UserEntity,
        _relations?: string[] | (keyof UserEntity)[]
    ): Promise<UserEntity> {
        const result = await this.userRepo
            .createQueryBuilder('user')
            .insert()
            .values(data)
            .execute();
        const sms = await this.get(result.identifiers[0].id, _relations);
        return sms!;
    }

    async createMultiple(list: UserEntity[]): Promise<string[]> {
        const result = await this.userRepo
            .createQueryBuilder('user')
            .insert()
            .values(list)
            .execute();
        return result.identifiers.map((identifier) => identifier.id);
    }

    async update(id: string, data: UserEntity): Promise<boolean> {
        const result = await this.userRepo
            .createQueryBuilder('user')
            .update(data)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(
        id: string,
        data: UserEntity,
        _relations?: string[] | (keyof UserEntity)[]
    ): Promise<UserEntity> {
        const result = await this.userRepo
            .createQueryBuilder('user')
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
        data: UserEntity,
        fields: (keyof UserEntity)[]
    ): Promise<boolean> {
        const obj = {} as any;
        fields.forEach((field) => {
            obj[field] = data[field as any];
        });

        const result = await this.userRepo
            .createQueryBuilder('user')
            .update(obj)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.userRepo
            .createQueryBuilder('user')
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.userRepo
            .createQueryBuilder('user')
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.userRepo
            .createQueryBuilder('user')
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.userRepo
            .createQueryBuilder('user')
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: string): Promise<boolean> {
        const result = await this.userRepo
            .createQueryBuilder('user')
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: string[]): Promise<boolean> {
        const result = await this.userRepo
            .createQueryBuilder('user')
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async joinWithRBAC(id: string): Promise<UserEntity> {
        return await this.userRepo
            .createQueryBuilder('users')
            .leftJoin('users.userRoles', 'userRoles')
            .leftJoin('userRoles.role', 'role')
            .leftJoin('role.rolePermissions', 'rolePermissions')
            .leftJoin('rolePermissions.permission', 'permission')
            .select([
                'users',
                'userRoles.id',
                'role.id',
                'role.name',
                'rolePermissions.id',
                'permission.id',
                'permission.name',
            ])
            .where('user.id = :id', { id })
            .getOne();
    }
}
