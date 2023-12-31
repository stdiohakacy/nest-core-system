import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettingService } from '../services/setting.service';
import { PaginationService } from '../../../common/pagination/services/pagination.service';
import {
    SettingPublicGetDoc,
    SettingPublicListDoc,
} from '../docs/setting.public.doc';
import {
    Response,
    ResponsePaging,
} from '../../../common/response/decorators/response.decorator';
import { SettingListSerialization } from '../serializations/setting.list.serialization';
import { PaginationQuery } from '../../../common/pagination/decorators/pagination.decorator';
import {
    SETTING_DEFAULT_AVAILABLE_ORDER_BY,
    SETTING_DEFAULT_AVAILABLE_SEARCH,
    SETTING_DEFAULT_ORDER_BY,
    SETTING_DEFAULT_ORDER_DIRECTION,
    SETTING_DEFAULT_PER_PAGE,
} from '../constants/setting.list.constant';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import {
    IResponse,
    IResponsePaging,
} from '../../../common/response/interfaces/response.interface';
import { SettingGetSerialization } from '../serializations/setting.get.serialization';
import { SettingPublicGetGuard } from '../decorators/setting.public.decorator';
import { RequestParamGuard } from '../../../common/request/decorators/request.decorator';
import { SettingRequestDTO } from '../dtos/setting.request.dto';
import { GetSetting } from '../decorators/setting.decorator';
import { SettingEntity } from '../../../modules/setting/entities/setting.entity';

@ApiTags('common.public.setting')
@Controller({
    version: '1',
    path: '/setting',
})
export class SettingPublicController {
    constructor(
        private readonly settingService: SettingService,
        private readonly paginationService: PaginationService
    ) {}

    @SettingPublicListDoc()
    @ResponsePaging('setting.list', { serialization: SettingListSerialization })
    @Get('/list')
    async list(
        @PaginationQuery(
            SETTING_DEFAULT_PER_PAGE,
            SETTING_DEFAULT_ORDER_BY,
            SETTING_DEFAULT_ORDER_DIRECTION,
            SETTING_DEFAULT_AVAILABLE_SEARCH,
            SETTING_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
        };

        const pagination = {
            _limit,
            _offset,
            _order,
        } as PaginationListDTO;

        const [settings, total] = await this.settingService.findAllAndCount(
            find,
            pagination
        );
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { total, totalPage },
            data: settings,
        };
    }

    @SettingPublicGetDoc()
    @Response('setting.get', { serialization: SettingGetSerialization })
    @SettingPublicGetGuard()
    @RequestParamGuard(SettingRequestDTO)
    @Get('get/:setting')
    async get(@GetSetting(true) setting: SettingEntity): Promise<IResponse> {
        return { data: setting };
    }
}
