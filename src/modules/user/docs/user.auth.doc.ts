import { applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocRequestFile,
    DocResponse,
} from '../../../common/doc/decorators/doc.decorator';
import { UserRefreshSerialization } from '../serializations/user.refresh.serialization';
import { UserProfileSerialization } from '../serializations/user.profile.serialization';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/doc/constants/doc.enum.constant';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';

export function UserAuthRefreshDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtRefreshToken: true }),
        DocResponse<UserRefreshSerialization>('user.refresh', {
            serialization: UserRefreshSerialization,
        })
    );
}

export function UserAuthProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtAccessToken: true }),
        DocResponse<UserProfileSerialization>('user.profile', {
            serialization: UserProfileSerialization,
        })
    );
}

export function UserAuthUploadProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequestFile(),
        DocResponse('user.upload')
    );
}

export function UserAuthUpdateProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('user.updateProfile')
    );
}

export function UserAuthInfoDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtAccessToken: true }),
        DocResponse<UserPayloadSerialization>('user.info', {
            serialization: UserPayloadSerialization,
        })
    );
}

export function UserAuthChangePasswordDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('user.changePassword')
    );
}

export function UserAuthClaimUsernameDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.auth.user' }),
        DocAuth({ jwtAccessToken: true }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('user.claimUsername')
    );
}
