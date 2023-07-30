import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../common/doc/constants/doc.enum.constant';
import {
    Doc,
    DocRequest,
    DocResponse,
} from '../../../common/doc/decorators/doc.decorator';

export function SMSPublicSendDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.public.sms' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('sms.send')
    );
}
