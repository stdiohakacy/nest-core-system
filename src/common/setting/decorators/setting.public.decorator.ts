import { UseGuards, applyDecorators } from '@nestjs/common';
import { SettingNotFoundGuard } from '@common/setting/guards/setting.not-found.guard';
import { SettingPutToRequestGuard } from '@common/setting/guards/setting.put-to-request.guard';

export function SettingPublicGetGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(SettingPutToRequestGuard, SettingNotFoundGuard)
    );
}
