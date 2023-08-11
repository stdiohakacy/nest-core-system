import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocGuard,
    DocResponsePaging,
} from '../../../common/doc/decorators/doc.decorator';
import { ConversationListSerialization } from '../serializations/conversation.list.serialization';

export function ConversationAuthListByUserDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.auth.conversation' }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true, policy: true }),
        DocResponsePaging<ConversationListSerialization>(
            'conversation.listByUser',
            { serialization: ConversationListSerialization }
        )
    );
}
