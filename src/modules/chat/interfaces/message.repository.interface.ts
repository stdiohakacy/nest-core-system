import { SelectFilterPaginationQuery } from '../../../common/base/repository/core.repository';
import { MessageEntity } from '../entities/message.entity';

export interface IMessageRepository {
    getByConversation(
        filter: SelectFilterPaginationQuery<MessageEntity>,
        conversationId: string
    ): Promise<[MessageEntity[], number]>;
}
