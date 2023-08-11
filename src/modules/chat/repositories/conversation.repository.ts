import { Injectable } from '@nestjs/common';
import { ConversationEntity } from '../entities/conversation.entity';
import { BaseRepository } from 'src/common/base/repository/base.repository';
import { IConversationRepository } from '../interfaces/conversation.repository.interface';
import { PaginationListDTO } from 'src/common/pagination/dtos/pagination.list.dto';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConversationRepository
    extends BaseRepository<ConversationEntity>
    implements IConversationRepository
{
    constructor(
        @InjectRepository(ConversationEntity)
        private readonly conversationRepo: Repository<ConversationEntity>
    ) {
        super();
    }

    async findByUserId(userId: string): Promise<ConversationEntity[]> {
        return await this.conversationRepo.find({ where: { userId } });
    }

    async findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ) {
        const { _limit, _offset, _order } = pagination;
        return await this.conversationRepo.findAndCount({
            where: find,
            take: _limit,
            skip: _offset,
            order: _order,
        });
    }

    findOneById(id: string) {
        throw new Error('Method not implemented.');
    }
    findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        throw new Error('Method not implemented.');
    }
    create(entity: ConversationEntity): Promise<ConversationEntity> {
        throw new Error('Method not implemented.');
    }
    update(entity: Partial<ConversationEntity>): Promise<ConversationEntity> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
    truncate(): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
}
