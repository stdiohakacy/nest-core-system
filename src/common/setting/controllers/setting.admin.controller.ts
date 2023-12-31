import { BadRequestException, Body, Controller, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettingService } from '../services/setting.service';
import { SettingAdminUpdateDoc } from '../docs/setting.admin.doc';
import { Response } from '../../../common/response/decorators/response.decorator';
import { ResponseIdSerialization } from '../../../common/response/serializations/response.id.serialization';
import { SettingRequestDTO } from '../dtos/setting.request.dto';
import { RequestParamGuard } from '../../../common/request/decorators/request.decorator';
import { GetSetting } from '../decorators/setting.decorator';
import { SettingEntity } from '../../../modules/setting/entities/setting.entity';
import { SettingUpdateValueDTO } from '../dtos/setting.update-value.dto';
import { IResponse } from '../../../common/response/interfaces/response.interface';
import { ENUM_SETTING_STATUS_CODE_ERROR } from '../constants/setting.status-code.constant';
import { SettingAdminUpdateGuard } from '../decorators/setting.admin.decorator';

@ApiTags('common.admin.setting')
@Controller({
    version: '1',
    path: '/setting',
})
export class SettingAdminController {
    constructor(private readonly settingService: SettingService) {}

    @SettingAdminUpdateDoc()
    @Response('setting.update', { serialization: ResponseIdSerialization })
    @SettingAdminUpdateGuard()
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
