import { DeleteResult, Repository, InsertResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { BaseRepository } from '../../../common/base/repository/base.repository';
import { UserConversationEntity } from '../entities/user-conversation.entity';
import { IUserConversationRepository } from '../interfaces/user-conversation.repository.interface';

@Injectable()
export class UserConversationRepository
    extends BaseRepository<UserConversationEntity>
    implements IUserConversationRepository
{
    constructor(
        @InjectRepository(UserConversationEntity)
        private readonly userConversationRepo: Repository<UserConversationEntity>
    ) {
        super();
    }

    async createMany(userConversations: any[]): Promise<void> {
        await this.userConversationRepo.save(
            this.userConversationRepo.create(userConversations)
        );
    }

    findOneById(id: string) {
        throw new Error('Method not implemented.');
    }

    findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        throw new Error('Method not implemented.');
    }

    async create(
        userConversation: UserConversationEntity
    ): Promise<UserConversationEntity> {
        return await this.userConversationRepo.save(userConversation);
    }

    update(
        entity: Partial<UserConversationEntity>
    ): Promise<UserConversationEntity> {
        throw new Error('Method not implemented.');
    }

    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }

    async truncate(): Promise<DeleteResult> {
        return await this.userConversationRepo.delete({});
    }
}
