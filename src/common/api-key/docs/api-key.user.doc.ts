import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocGuard,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from '../../../common/doc/decorators/doc.decorator';
import {
    ApiKeyDocParamsId,
    ApiKeyDocQueryIsActive,
} from '../constants/api-key.doc.constant';
import { ApiKeyListSerialization } from '../serializations/api-key.list.serialization';
import { ApiKeyGetSerialization } from '../serializations/api-key.get.serialization';
import { ApiKeyCreateSerialization } from '../serializations/api-key.create.serialization';
import { ApiKeyResetSerialization } from '../serializations/api-key.reset.serialization';
import { ResponseIdSerialization } from '../../../common/response/serializations/response.id.serialization';

export function ApiKeyUserListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.user.apiKey' }),
        DocRequest({ queries: ApiKeyDocQueryIsActive }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponsePaging<ApiKeyListSerialization>('apiKey.list', {
            serialization: ApiKeyListSerialization,
        })
    );
}

export function ApiKeyUserGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.user.apiKey' }),
        DocRequest({ params: ApiKeyDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse<ApiKeyGetSerialization>('apiKey.get', {
            serialization: ApiKeyGetSerialization,
        })
    );
}

export function ApiKeyUserCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.user.apiKey' }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse<ApiKeyCreateSerialization>('apiKey.create', {
            httpStatus: HttpStatus.CREATED,
            serialization: ApiKeyCreateSerialization,
        })
    );
}

export function ApiKeyUserActiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.user.apiKey' }),
        DocRequest({ params: ApiKeyDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('apiKey.active')
    );
}

export function ApiKeyUserInactiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.user.apiKey' }),
        DocRequest({ params: ApiKeyDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('apiKey.inactive')
    );
}

export function ApiKeyUserResetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.user.apiKey' }),
        DocRequest({ params: ApiKeyDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse<ApiKeyResetSerialization>('apiKey.reset', {
            serialization: ApiKeyResetSerialization,
        })
    );
}

export function ApiKeyUserUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.user.apiKey' }),
        DocRequest({ params: ApiKeyDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse<ResponseIdSerialization>('apiKey.update', {
            serialization: ResponseIdSerialization,
        })
    );
}

export function ApiKeyUserDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.user.apiKey' }),
        DocRequest({ params: ApiKeyDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true }),
        DocResponse('apiKey.delete')
    );
}
