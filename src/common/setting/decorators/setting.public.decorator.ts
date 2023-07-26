import { UseGuards, applyDecorators } from '@nestjs/common';
import { SettingPutToRequestGuard } from '../guards/setting.put-to-request.guard';
import { SettingNotFoundGuard } from '../guards/setting.not-found.guard';

export function SettingPublicGetGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(SettingPutToRequestGuard, SettingNotFoundGuard)
    );
}
