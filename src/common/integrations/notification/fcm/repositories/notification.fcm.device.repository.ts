import { UpdateResult, DeleteResult, Repository, InsertResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { DeviceEntity } from 'src/modules/notification/entities/device.entity';
import { INotificationFCMDeviceRepository } from '../interfaces/notification.fcm.device.repository.interface';
import { PaginationListDTO } from 'src/common/pagination/dtos/pagination.list.dto';

@Injectable()
export class NotificationFCMDeviceRepository
    extends BaseRepository<DeviceEntity>
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

    findOneById(id: string) {
        throw new Error('Method not implemented.');
    }
    findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        throw new Error('Method not implemented.');
    }
    async create(device: DeviceEntity): Promise<InsertResult> {
        return await this.deviceRepo.insert(device);
    }
    update(entity: Partial<DeviceEntity>): Promise<DeviceEntity> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
    truncate(): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
}
