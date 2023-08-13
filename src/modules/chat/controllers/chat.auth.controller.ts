import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { PaginationQuery } from '../../../common/pagination/decorators/pagination.decorator';
import {
    Response,
    ResponsePaging,
} from '../../../common/response/decorators/response.decorator';
import {
    CONVERSATION_DEFAULT_AVAILABLE_ORDER_BY,
    CONVERSATION_DEFAULT_AVAILABLE_SEARCH,
    CONVERSATION_DEFAULT_ORDER_BY,
    CONVERSATION_DEFAULT_ORDER_DIRECTION,
    CONVERSATION_DEFAULT_PER_PAGE,
} from '../constants/conversation.list.constant';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import {
    IResponse,
    IResponsePaging,
} from '../../../common/response/interfaces/response.interface';

import { ConversationListByUserQuery } from '../queries/conversation.list-by-user.query';
import { ConversationListSerialization } from '../serializations/conversation.list.serialization';
import { ConversationAuthListByUserDoc } from '../docs/conversation.auth.doc';
import { AuthJwtAccessProtected } from '../../../common/auth/decorators/auth.jwt.decorator';
import { GetUser, UserProtected } from '../../user/decorators/user.decorator';
import { UserEntity } from '../../user/entities/user.entity';
import util from 'util';
import { MessageListByConversationQuery } from '../queries/message.list-by-conversation.query';
import { MessageListSerialization } from '../serializations/message.list.serialization';
import { MessageAuthListByConversationDoc } from '../docs/message.auth.doc';

@ApiTags('modules.auth.chat')
@Controller({ version: '1', path: '/chat' })
export class ConversationAuthController {
    constructor(private readonly queryBus: QueryBus) {}

    @ConversationAuthListByUserDoc()
    @ResponsePaging('chat.conversation.listByUser', {
        serialization: ConversationListSerialization,
    })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/conversations')
    async listByUser(
        @GetUser() userAuth: UserEntity,
        @PaginationQuery(
            CONVERSATION_DEFAULT_PER_PAGE,
            CONVERSATION_DEFAULT_ORDER_BY,
            CONVERSATION_DEFAULT_ORDER_DIRECTION,
            CONVERSATION_DEFAULT_AVAILABLE_SEARCH,
            CONVERSATION_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = { ..._search };

        const pagination = {
            _limit,
            _offset,
            _order,
        } as PaginationListDTO;
        return await this.queryBus.execute(
            new ConversationListByUserQuery(userAuth.id, find, pagination)
        );
    }

    @MessageAuthListByConversationDoc()
    @ResponsePaging('chat.message.listByConversation', {
        serialization: MessageListSerialization,
    })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/conversations/:conversationId/messages')
    async listByConversation(
        @PaginationQuery(
            CONVERSATION_DEFAULT_PER_PAGE,
            CONVERSATION_DEFAULT_ORDER_BY,
            CONVERSATION_DEFAULT_ORDER_DIRECTION,
            CONVERSATION_DEFAULT_AVAILABLE_SEARCH,
            CONVERSATION_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO,
        @Param('conversationId') conversationId: string
    ): Promise<IResponse> {
        const find: Record<string, any> = { ..._search };

        const pagination = {
            _limit,
            _offset,
            _order,
        } as PaginationListDTO;

        return await this.queryBus.execute(
            new MessageListByConversationQuery(conversationId, find, pagination)
        );
    }
}
