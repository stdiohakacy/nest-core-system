import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { DeviceEntity } from '../../../../../modules/notification/entities/device.entity';
import {
    CoreRepository,
    SelectFilterListQuery,
    SelectFilterPaginationQuery,
    SelectFilterQuery,
    SelectSortQuery,
} from '../../../../../common/base/repository/core.repository';
import { INotificationFCMDeviceRepository } from '../interfaces/notification.fcm.device.repository.interface';

@Injectable()
export class DeviceRepository
    extends CoreRepository<DeviceEntity>
    implements INotificationFCMDeviceRepository
{
    constructor(
        @InjectRepository(DeviceEntity)
        private readonly deviceRepo: Repository<DeviceEntity>
    ) {
        super();
    }

    async findByUserId(userId: string): Promise<DeviceEntity[]> {
        return await this.deviceRepo.find({ where: { userId } });
    }

    async isDeviceExist(type: string, userId: string): Promise<boolean> {
        const device = await this.deviceRepo.findOneBy({ userId, type });
        return !!device;
    }

    async findAll(
        filter: SelectFilterListQuery<DeviceEntity>
    ): Promise<DeviceEntity[]> {
        const query = this.deviceRepo.createQueryBuilder('device');
        // this.handleSortQuery(query, filter.sorts);
        const list = await query.getMany();
        return list;
    }

    async find(
        filter: SelectFilterPaginationQuery<DeviceEntity>
    ): Promise<DeviceEntity[]> {
        const query = this.deviceRepo.createQueryBuilder('device');
        // this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const list = await query.getMany();
        return list;
    }

    async findOne(
        _filter: SelectFilterQuery<DeviceEntity>
    ): Promise<DeviceEntity> {
        const query = this.deviceRepo.createQueryBuilder('device');
        const result = await query.getOne();
        return result;
    }

    async findAndCount(
        filter: SelectFilterPaginationQuery<DeviceEntity>
    ): Promise<[DeviceEntity[], number]> {
        const query = this.deviceRepo.createQueryBuilder('device');
        // this.handleSortQuery(query, filter.sorts);
        query.skip(filter.skip);
        query.take(filter.limit);
        const result = await query.getManyAndCount();
        return result;
    }

    async count(_filter: SelectFilterQuery<DeviceEntity>): Promise<number> {
        const query = this.deviceRepo.createQueryBuilder('device');
        return await query.getCount();
    }

    async get(
        id: string,
        _relations?: string[] | (keyof DeviceEntity)[]
    ): Promise<DeviceEntity> {
        const query = this.deviceRepo
            .createQueryBuilder('device')
            .whereInIds(id);
        const result = await query.getOne();
        return result;
    }

    async create(data: DeviceEntity): Promise<string> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .insert()
            .values(data)
            .execute();
        return result.identifiers[0].id;
    }

    async createGet(
        data: DeviceEntity,
        _relations?: string[] | (keyof DeviceEntity)[]
    ): Promise<DeviceEntity> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .insert()
            .values(data)
            .execute();
        const device = await this.get(result.identifiers[0].id, _relations);
        return device!;
    }

    async createMultiple(list: DeviceEntity[]): Promise<string[]> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .insert()
            .values(list)
            .execute();
        return result.identifiers.map((identifier) => identifier.id);
    }

    async update(id: string, data: DeviceEntity): Promise<boolean> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .update(data)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async updateGet(
        id: string,
        data: DeviceEntity,
        _relations?: string[] | (keyof DeviceEntity)[]
    ): Promise<DeviceEntity> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .update(data)
            .whereInIds(id)
            .execute();

        if (!result.affected) {
            return;
        }
        const device = await this.get(id, _relations);
        return device;
    }

    async updateFields(
        id: string,
        data: DeviceEntity,
        fields: (keyof DeviceEntity)[]
    ): Promise<boolean> {
        const obj = {} as any;
        fields.forEach((field) => {
            obj[field] = data[field as any];
        });

        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .update(obj)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async deleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async softDelete(id: string): Promise<boolean> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async softDeleteMultiple(ids: string[]): Promise<boolean> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }

    async restore(id: string): Promise<boolean> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .restore()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async restoreMultiple(ids: string[]): Promise<boolean> {
        const result = await this.deviceRepo
            .createQueryBuilder('device')
            .restore()
            .whereInIds(ids)
            .execute();
        return !!result.affected && result.affected === ids.length;
    }
}
