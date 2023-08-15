import { QueryHandler, IQuery, IQueryHandler } from '@nestjs/cqrs';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { ConversationRepository } from '../repositories/conversation.repository';
import { PaginationService } from '../../../common/pagination/services/pagination.service';
import { UserRepository } from '../../../modules/user/repositories/user.repository';
import { SelectFilterPaginationQuery } from 'src/common/base/repository/core.repository';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserConversationRepository } from '../repositories/user-conversation.repository';
import { UserConversationEntity } from '../entities/user-conversation.entity';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from 'src/common/pagination/constants/pagination.enum.constant';

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
        private readonly paginationService: PaginationService,
        private readonly userConversationRepo: UserConversationRepository
    ) {}

    async execute({ userId, find, pagination }: ConversationListByUserQuery) {
        const filter: SelectFilterPaginationQuery<UserConversationEntity> = {
            limit: pagination._limit,
            skip: pagination._offset,
            conditionals: [{ userId }],
        };

        const [userConversations, total] =
            await this.userConversationRepo.findAndCount(filter);

        const totalPage = this.paginationService.totalPage(
            total,
            pagination._limit
        );
        return {
            _pagination: { total, totalPage },
            data: userConversations,
        };
    }
}
