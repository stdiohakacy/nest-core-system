import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocRequest,
    DocResponse,
} from '../../../common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/doc/constants/doc.enum.constant';

export function PostPublicSearchDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.public.post' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('post.search')
    );
}
