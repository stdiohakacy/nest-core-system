import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { PaginationListDTO } from 'src/common/pagination/dtos/pagination.list.dto';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../entities/message.entity';
import { IMessageRepository } from '../interfaces/message.repository.interface';

@Injectable()
export class MessageRepository
    extends BaseRepository<MessageEntity>
    implements IMessageRepository
{
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepo: Repository<MessageEntity>
    ) {
        super();
    }

    async createMany(messages: any[]): Promise<void> {
        await this.messageRepo.save(this.messageRepo.create(messages));
    }

    findOneById(id: string) {
        throw new Error('Method not implemented.');
    }
    findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        throw new Error('Method not implemented.');
    }
    create(entity: MessageEntity): Promise<MessageEntity> {
        throw new Error('Method not implemented.');
    }
    update(entity: Partial<MessageEntity>): Promise<MessageEntity> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
    truncate(): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
}
