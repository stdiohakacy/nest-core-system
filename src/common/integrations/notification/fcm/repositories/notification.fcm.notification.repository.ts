import { DeleteResult, Repository, InsertResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../../../common/base/repository/base.repository';
import { PaginationListDTO } from '../../../../../common/pagination/dtos/pagination.list.dto';
import { NotificationEntity } from '../../../../../modules/notification/entities/notification.entity';

@Injectable()
export class NotificationFCMNotificationRepository extends BaseRepository<NotificationEntity> {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepo: Repository<NotificationEntity>
    ) {
        super();
    }

    findOneById(id: string) {
        throw new Error('Method not implemented.');
    }
    findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        throw new Error('Method not implemented.');
    }
    async create(
        notification: NotificationEntity
    ): Promise<NotificationEntity> {
        return await this.notificationRepo.save(notification);
    }
    update(entity: Partial<NotificationEntity>): Promise<NotificationEntity> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
    truncate(): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
}
