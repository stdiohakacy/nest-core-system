import { BadRequestException, Body, Controller, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtAdminAccessProtected } from '@common/auth/decorators/auth.jwt.decorator';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from '@common/policy/constants/policy.enum.constant';
import { PolicyAbilityProtected } from '@common/policy/decorators/policy.decorator';
import { RequestParamGuard } from '@common/request/decorators/request.decorator';
import { Response } from '@common/response/decorators/response.decorator';
import { IResponse } from '@common/response/interfaces/response.interface';
import { ResponseIdSerialization } from '@common/response/serializations/response.id.serialization';
import { ENUM_SETTING_STATUS_CODE_ERROR } from '@common/setting/constants/setting.status-code.constant';
import { SettingAdminUpdateGuard } from '@common/setting/decorators/setting.admin.decorator';
import { GetSetting } from '@common/setting/decorators/setting.decorator';
import { SettingAdminUpdateDoc } from '@common/setting/docs/setting.admin.doc';
import { SettingRequestDTO } from '@common/setting/dtos/setting.request.dto';
import { SettingUpdateValueDTO } from '@common/setting/dtos/setting.update-value.dto';
import { SettingService } from '@common/setting/services/setting.service';
import { SettingEntity } from '@modules/setting/entities/setting.entity';

@ApiTags('common.admin.setting')
@Controller({
    version: '1',
    path: '/setting',
})
export class SettingAdminController {
    constructor(private readonly settingService: SettingService) {}

    @SettingAdminUpdateDoc()
    @Response('setting.update', {
        serialization: ResponseIdSerialization,
    })
    @SettingAdminUpdateGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.SETTING,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(SettingRequestDTO)
    @Put('/update/:setting')
    async update(
        @GetSetting() setting: SettingEntity,
        @Body()
        body: SettingUpdateValueDTO
    ): Promise<IResponse> {
        const check = await this.settingService.checkValue(
            body.value,
            body.type
        );
        if (!check) {
            throw new BadRequestException({
                statusCode:
                    ENUM_SETTING_STATUS_CODE_ERROR.SETTING_VALUE_NOT_ALLOWED_ERROR,
                message: 'setting.error.valueNotAllowed',
            });
        }

        await this.settingService.updateValue(setting, body);

        return {
            data: { _id: setting.id },
        };
    }
}
