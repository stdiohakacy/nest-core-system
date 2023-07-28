import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
    Doc,
    DocRequest,
    DocResponse,
} from '../../../common/doc/decorators/doc.decorator';
import { UserLoginSerialization } from '../serializations/user.login.serialization';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/doc/constants/doc.enum.constant';

export function UserPublicLoginDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.public.user' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse<UserLoginSerialization>('user.login', {
            serialization: UserLoginSerialization,
        })
    );
}

export function UserPublicSignUpDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.public.user' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('user.signUp', { httpStatus: HttpStatus.CREATED })
    );
}

export function UserPublicActiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.public.user' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('user.active', { httpStatus: HttpStatus.CREATED })
    );
}

export function UserPublicForgotPasswordDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.public.user' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('user.forgotPassword')
    );
}

export function UserPublicResetPasswordDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.public.user' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('user.resetPassword')
    );
}
