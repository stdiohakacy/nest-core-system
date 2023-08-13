import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocGuard,
    DocResponsePaging,
} from '../../../common/doc/decorators/doc.decorator';
import { MessageListSerialization } from '../serializations/message.list.serialization';

export function MessageAuthListByConversationDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.auth.message' }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true, policy: true }),
        DocResponsePaging<MessageListSerialization>(
            'message.listByConversation',
            { serialization: MessageListSerialization }
        )
    );
}
