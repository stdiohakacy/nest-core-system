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
    async create(
        conversation: ConversationEntity
    ): Promise<ConversationEntity> {
        return await this.conversationRepo.save(conversation);
    }
    async createMany(conversations: any[]): Promise<void> {
        await this.conversationRepo.save(
            this.conversationRepo.create(conversations)
        );
    }
    update(entity: Partial<ConversationEntity>): Promise<ConversationEntity> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
    async truncate(): Promise<DeleteResult> {
        return await this.conversationRepo.delete({});
    }
    async findOne(): Promise<ConversationEntity> {
        return await this.conversationRepo.findOne({});
    }
}
