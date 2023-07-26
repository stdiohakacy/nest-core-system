import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocAuth,
    DocDefault,
    DocErrorGroup,
    DocGuard,
    DocRequest,
    DocResponse,
} from '../../../common/doc/decorators/doc.decorator';
import { SettingDocParamsId } from '../constants/setting.doc.constant';
import { ResponseIdSerialization } from '../../../common/response/serializations/response.id.serialization';
import { ENUM_SETTING_STATUS_CODE_ERROR } from '../constants/setting.status-code.constant';

export function SettingAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.admin.setting' }),
        DocRequest({ params: SettingDocParamsId }),
        DocAuth({ jwtAccessToken: true }),
        DocResponse<ResponseIdSerialization>('setting.update', {
            serialization: ResponseIdSerialization,
        }),
        DocGuard({ role: true, policy: true }),
        DocErrorGroup([
            DocDefault({
                httpStatus: HttpStatus.NOT_FOUND,
                statusCode:
                    ENUM_SETTING_STATUS_CODE_ERROR.SETTING_NOT_FOUND_ERROR,
                messagePath: 'setting.error.notFound',
            }),
            DocDefault({
                httpStatus: HttpStatus.BAD_REQUEST,
                statusCode:
                    ENUM_SETTING_STATUS_CODE_ERROR.SETTING_VALUE_NOT_ALLOWED_ERROR,
                messagePath: 'setting.error.valueNotAllowed',
            }),
        ])
    );
}
