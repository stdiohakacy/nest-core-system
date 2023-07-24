import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { SettingEntity } from 'src/modules/setting/entities/setting.entity';

export const GetSetting = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): any | SettingEntity => {
        const { __setting } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __setting: SettingEntity }>();
        return returnPlain ? instanceToPlain(__setting) : __setting;
    }
);
