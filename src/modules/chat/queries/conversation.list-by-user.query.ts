import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { ConversationRepository } from '../repositories/conversation.repository';
import { PaginationService } from '../../../common/pagination/services/pagination.service';

export class ConversationListByUserQuery implements IQuery {
    constructor(
        public readonly userId: string,
        public readonly find: Record<string, any>,
        public readonly pagination: PaginationListDTO
    ) {}
}

@QueryHandler(ConversationListByUserQuery)
export class ConversationListByUserHandler
    implements IQueryHandler<ConversationListByUserQuery>
{
    constructor(
        private readonly conversationRepo: ConversationRepository,
        private readonly paginationService: PaginationService
    ) {}

    async execute({ userId, find, pagination }: ConversationListByUserQuery) {
        find.userId = userId;

        // const [conversations, total] =
        //     await this.conversationRepo.findAllAndCount(find, pagination);
        // const totalPage = this.paginationService.totalPage(
        //     total,
        //     pagination._limit
        // );

        // return {
        //     _pagination: { total, totalPage },
        //     data: conversations,
        // };
    }
}
