import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SettingService } from '../services/setting.service';
import { SettingEntity } from '../../../modules/setting/entities/setting.entity';

@Injectable()
export class SettingPutToRequestGuard implements CanActivate {
    constructor(private readonly settingService: SettingService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { setting } = params;

        const check: SettingEntity = await this.settingService.findOneById(
            setting
        );
        request.__setting = check;

        return true;
    }
}
