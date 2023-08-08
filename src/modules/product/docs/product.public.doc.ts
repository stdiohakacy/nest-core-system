import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocRequest,
    DocResponse,
} from '../../../common/doc/decorators/doc.decorator';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';

export function ProductPublicCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.public.user' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('user.signUp', { httpStatus: HttpStatus.CREATED })
    );
}
