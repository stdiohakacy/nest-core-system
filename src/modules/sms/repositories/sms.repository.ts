import { DeleteResult, Repository, InsertResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { BaseRepository } from '../../../common/base/repository/base.repository';
import { SmsEntity } from '../entities/sms.entity';
import { ISmsRepository } from '../interfaces/sms.repository.interface';

@Injectable()
export class SmsRepository
    extends BaseRepository<SmsEntity>
    implements ISmsRepository
{
    constructor(
        @InjectRepository(SmsEntity)
        private readonly smsRepo: Repository<SmsEntity>
    ) {
        super();
    }

    findOneById(id: string) {
        throw new Error('Method not implemented.');
    }
    findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        throw new Error('Method not implemented.');
    }
    create(entity: SmsEntity): Promise<InsertResult> {
        throw new Error('Method not implemented.');
    }
    update(entity: Partial<SmsEntity>): Promise<SmsEntity> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
    truncate(): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }

    async createMany(sms: SmsEntity[]): Promise<void> {
        await this.smsRepo.save(sms);
    }
}
