import { applyDecorators } from '@nestjs/common';
import { Doc, DocResponse } from '@common/doc/decorators/doc.decorator';
import { MessageLanguageSerialization } from '@common/message/serializations/message.language.serialization';

export function MessagePublicLanguageDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.public.message' }),
        DocResponse<MessageLanguageSerialization>('apiKey.languages', {
            serialization: MessageLanguageSerialization,
        })
    );
}
