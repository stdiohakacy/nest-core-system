import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '../../../../../common/doc/constants/doc.enum.constant';
import {
    Doc,
    DocRequest,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';

export function NotificationFCMPublicRegisterDeviceDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'modules.public.user' }),
        DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
        DocResponse('notification.fcm.registerDeviceSucceed', {
            httpStatus: HttpStatus.CREATED,
        })
    );
}
