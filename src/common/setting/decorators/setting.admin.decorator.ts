import { applyDecorators, UseGuards } from '@nestjs/common';
import { SettingPutToRequestGuard } from '../guards/setting.put-to-request.guard';
import { SettingNotFoundGuard } from '../guards/setting.not-found.guard';

export function SettingAdminUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(SettingPutToRequestGuard, SettingNotFoundGuard)
    );
}
