import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MessageRepository } from '../repositories/message.repository';
import { SelectFilterPaginationQuery } from '../../../common/base/repository/core.repository';
import { MessageEntity } from '../entities/message.entity';
import { PaginationService } from '../../../common/pagination/services/pagination.service';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { instanceToPlain } from 'class-transformer';

export class MessageListByConversationQuery implements IQuery {
    constructor(
        public readonly conversationId: string,
        public readonly find: Record<string, any>,
        public readonly pagination: PaginationListDTO
    ) {}
}

@QueryHandler(MessageListByConversationQuery)
export class MessageListByConversationHandler
    implements IQueryHandler<MessageListByConversationQuery>
{
    constructor(
        private readonly messageRepo: MessageRepository,
        private readonly paginationService: PaginationService
    ) {}

    async execute({
        conversationId,
        find,
        pagination,
    }: MessageListByConversationQuery) {
        const filter: SelectFilterPaginationQuery<MessageEntity> = {
            limit: pagination._limit,
            skip: pagination._offset,
            conditionals: [{ conversationId }],
        };
        const [messages, total] = await this.messageRepo.findAndCount(filter);

        const totalPage = this.paginationService.totalPage(
            total,
            pagination._limit
        );
        return instanceToPlain({
            _pagination: { total, totalPage },
            data: messages,
        });
    }
}
