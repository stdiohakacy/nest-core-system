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
    RoleDocParamsId,
    RoleDocQueryIsActive,
    RoleDocQueryType,
} from '../constants/role.doc.constant';
import { RoleListSerialization } from '../serializations/role.list.serialization';
import { RoleGetSerialization } from '../serializations/role.get.serialization';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/doc/constants/doc.enum.constant';
import { ResponseIdSerialization } from '../../../common/response/serializations/response.id.serialization';

export function RoleAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.admin.role' }),
        DocRequest({ queries: [...RoleDocQueryIsActive, ...RoleDocQueryType] }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true, policy: true }),
        DocResponsePaging<RoleListSerialization>('role.list', {
            serialization: RoleListSerialization,
        })
    );
}

export function RoleAdminGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.admin.role' }),
        DocRequest({ params: RoleDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true, policy: true }),
        DocResponse<RoleGetSerialization>('role.get', {
            serialization: RoleGetSerialization,
        })
    );
}

export function RoleAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.admin.role' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('role.create', {
            httpStatus: HttpStatus.CREATED,
            serialization: ResponseIdSerialization,
        })
    );
}

export function RoleAdminActiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.admin.role' }),
        DocRequest({ params: RoleDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true, policy: true }),
        DocResponse('role.active')
    );
}

export function RoleAdminInactiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.admin.role' }),
        DocRequest({ params: RoleDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true, policy: true }),
        DocResponse('role.inactive')
    );
}

export function RoleAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.admin.role' }),
        DocRequest({
            params: RoleDocParamsId,
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
        }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('role.update', {
            serialization: ResponseIdSerialization,
        })
    );
}

export function RoleAdminDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.admin.role' }),
        DocRequest({ params: RoleDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocGuard({ role: true, policy: true }),
        DocResponse('role.delete')
    );
}
