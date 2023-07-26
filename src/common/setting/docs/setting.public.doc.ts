import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
    Doc,
    DocDefault,
    DocErrorGroup,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from '../../../common/doc/decorators/doc.decorator';
import { SettingListSerialization } from '../serializations/setting.list.serialization';
import { SettingGetSerialization } from '../serializations/setting.get.serialization';
import { SettingDocParamsId } from '../constants/setting.doc.constant';
import { ENUM_SETTING_STATUS_CODE_ERROR } from '../constants/setting.status-code.constant';

export function SettingPublicListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.public.setting' }),
        DocResponsePaging<SettingListSerialization>('setting.list', {
            serialization: SettingListSerialization,
        })
    );
}

export function SettingPublicGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.public.setting' }),
        DocRequest({ params: SettingDocParamsId }),
        DocResponse<SettingGetSerialization>('setting.get', {
            serialization: SettingGetSerialization,
        }),
        DocErrorGroup([
            DocDefault({
                httpStatus: HttpStatus.NOT_FOUND,
                statusCode:
                    ENUM_SETTING_STATUS_CODE_ERROR.SETTING_NOT_FOUND_ERROR,
                messagePath: 'setting.error.notFound',
            }),
        ])
    );
}
