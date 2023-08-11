import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { ConversationEntity } from '../entities/conversation.entity';

export interface IConversationRepository {
    findByUserId(userId: string): Promise<ConversationEntity[]>;
    createMany(users: any[]): Promise<void>;
    findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ): Promise<[ConversationEntity[], number]>;
}
