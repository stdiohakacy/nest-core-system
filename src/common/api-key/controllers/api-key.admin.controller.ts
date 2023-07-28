import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { ApiKeyService } from '../services/api-key.service';
import { PaginationService } from '../../../common/pagination/services/pagination.service';
import {
    ApiKeyAdminActiveDoc,
    ApiKeyAdminCreateDoc,
    ApiKeyAdminDeleteDoc,
    ApiKeyAdminGetDoc,
    ApiKeyAdminInactiveDoc,
    ApiKeyAdminListDoc,
    ApiKeyAdminResetDoc,
    ApiKeyAdminUpdateDoc,
} from '../docs/api-key.admin.doc';
import {
    Response,
    ResponsePaging,
} from '../../../common/response/decorators/response.decorator';
import { ApiKeyListSerialization } from '../serializations/api-key.list.serialization';
import {
    ApiKeyPublicProtected,
    GetApiKey,
} from '../decorators/api-key.decorator';
import {
    PaginationQuery,
    PaginationQueryFilterInBoolean,
    PaginationQueryFilterInEnum,
} from '../../../common/pagination/decorators/pagination.decorator';
import {
    API_KEY_DEFAULT_AVAILABLE_ORDER_BY,
    API_KEY_DEFAULT_AVAILABLE_SEARCH,
    API_KEY_DEFAULT_IS_ACTIVE,
    API_KEY_DEFAULT_ORDER_BY,
    API_KEY_DEFAULT_ORDER_DIRECTION,
    API_KEY_DEFAULT_PER_PAGE,
    API_KEY_DEFAULT_TYPE,
} from '../constants/api-key.list.constant';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { ENUM_API_KEY_TYPE } from '../constants/api-key.enum.constant';
import {
    IResponse,
    IResponsePaging,
} from '../../../common/response/interfaces/response.interface';
import { ApiKeyGetSerialization } from '../serializations/api-key.get.serialization';
import {
    ApiKeyAdminDeleteGuard,
    ApiKeyAdminGetGuard,
    ApiKeyAdminUpdateActiveGuard,
    ApiKeyAdminUpdateGuard,
    ApiKeyAdminUpdateInactiveGuard,
    ApiKeyAdminUpdateResetGuard,
} from '../decorators/api-key.admin.decorator';
import { RequestParamGuard } from '../../../common/request/decorators/request.decorator';
import { ApiKeyRequestDTO } from '../dtos/api-key.request.dto';
import { ApiKeyEntity } from '../../../modules/api-key/entities/api-key.entity';
import { ApiKeyCreateSerialization } from '../serializations/api-key.create.serialization';
import { ApiKeyCreateDTO } from '../dtos/api-key.create.dto';
import { IApiKeyCreated } from '../interfaces/api-key.interface';
import { ApiKeyResetSerialization } from '../serializations/api-key.reset.serialization';
import { ResponseIdSerialization } from '../../../common/response/serializations/response.id.serialization';
import { ApiKeyUpdateDTO } from '../dtos/api-key.update.dto';
import { ApiKeyUpdateDateDTO } from '../dtos/api-key.update-date.dto';

@ApiTags('common.admin.apiKey')
@Controller({
    version: '1',
    path: '/api-key',
})
export class ApiKeyAdminController {
    constructor(
        private readonly apiKeyService: ApiKeyService,
        private readonly paginationService: PaginationService
    ) {}

    @ApiKeyAdminListDoc()
    @ResponsePaging('apiKey.list', {
        serialization: ApiKeyListSerialization,
    })
    @ApiKeyPublicProtected()
    @Get('/list')
    async list(
        @PaginationQuery(
            API_KEY_DEFAULT_PER_PAGE,
            API_KEY_DEFAULT_ORDER_BY,
            API_KEY_DEFAULT_ORDER_DIRECTION,
            API_KEY_DEFAULT_AVAILABLE_SEARCH,
            API_KEY_DEFAULT_AVAILABLE_ORDER_BY
        )
        { _search, _limit, _offset, _order }: PaginationListDTO,
        @PaginationQueryFilterInBoolean('isActive', API_KEY_DEFAULT_IS_ACTIVE)
        isActive: Record<string, any>,
        @PaginationQueryFilterInEnum(
            'type',
            API_KEY_DEFAULT_TYPE,
            ENUM_API_KEY_TYPE
        )
        type: Record<string, any>
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ..._search,
            ...isActive,
            ...type,
        };

        const pagination = {
            _limit,
            _offset,
            _order,
        } as PaginationListDTO;

        const [apiKeys, total] = await this.apiKeyService.findAllAndCount(
            find,
            pagination
        );
        const totalPage = this.paginationService.totalPage(total, _limit);

        return {
            _pagination: { totalPage, total },
            data: apiKeys,
        };
    }

    @ApiKeyAdminGetDoc()
    @Response('apiKey.get', { serialization: ApiKeyGetSerialization })
    @ApiKeyAdminGetGuard()
    @ApiKeyPublicProtected()
    @RequestParamGuard(ApiKeyRequestDTO)
    @Get('/get/:apiKey')
    async get(@GetApiKey(true) apiKey: ApiKeyEntity): Promise<IResponse> {
        return { data: apiKey };
    }

    @ApiKeyAdminCreateDoc()
    @Response('apiKey.create', { serialization: ApiKeyCreateSerialization })
    @ApiKeyPublicProtected()
    @Post('/create')
    async create(@Body() body: ApiKeyCreateDTO): Promise<IResponse> {
        const created: IApiKeyCreated = await this.apiKeyService.create(body);

        return {
            data: {
                id: created.doc.id,
                secret: created.secret,
            },
        };
    }

    @ApiKeyAdminResetDoc()
    @Response('apiKey.reset', { serialization: ApiKeyResetSerialization })
    @ApiKeyAdminUpdateResetGuard()
    @ApiKeyPublicProtected()
    @RequestParamGuard(ApiKeyRequestDTO)
    @Patch('/update/:apiKey/reset')
    async reset(@GetApiKey() apiKey: ApiKeyEntity): Promise<IResponse> {
        const secret: string = await this.apiKeyService.createSecret();
        const updated: ApiKeyEntity = await this.apiKeyService.reset(
            apiKey,
            secret
        );

        return instanceToPlain({
            data: { id: updated.id, secret },
        });
    }

    @ApiKeyAdminUpdateDoc()
    @Response('apiKey.update', { serialization: ResponseIdSerialization })
    @ApiKeyAdminUpdateGuard()
    @ApiKeyPublicProtected()
    @RequestParamGuard(ApiKeyRequestDTO)
    @Put('/update/:apiKey')
    async updateName(
        @Body() body: ApiKeyUpdateDTO,
        @GetApiKey() apiKey: ApiKeyEntity
    ): Promise<IResponse> {
        await this.apiKeyService.update(apiKey, body);

        return { data: { id: apiKey.id } };
    }

    @ApiKeyAdminInactiveDoc()
    @Response('apiKey.inactive')
    @ApiKeyAdminUpdateInactiveGuard()
    @ApiKeyPublicProtected()
    @RequestParamGuard(ApiKeyRequestDTO)
    @Patch('/update/:apiKey/inactive')
    async inactive(@GetApiKey() apiKey: ApiKeyEntity): Promise<void> {
        await this.apiKeyService.inactive(apiKey);

        return;
    }

    @ApiKeyAdminActiveDoc()
    @Response('apiKey.active')
    @ApiKeyAdminUpdateActiveGuard()
    @ApiKeyPublicProtected()
    @RequestParamGuard(ApiKeyRequestDTO)
    @Patch('/update/:apiKey/active')
    async active(@GetApiKey() apiKey: ApiKeyEntity): Promise<void> {
        await this.apiKeyService.active(apiKey);

        return;
    }

    @ApiKeyAdminUpdateDoc()
    @Response('apiKey.updateDate', { serialization: ResponseIdSerialization })
    @ApiKeyAdminUpdateGuard()
    @ApiKeyPublicProtected()
    @RequestParamGuard(ApiKeyRequestDTO)
    @Put('/update/:apiKey/date')
    async updateDate(
        @Body() body: ApiKeyUpdateDateDTO,
        @GetApiKey() apiKey: ApiKeyEntity
    ): Promise<IResponse> {
        await this.apiKeyService.updateDate(apiKey, body);

        return { data: { id: apiKey.id } };
    }

    @ApiKeyAdminDeleteDoc()
    @Response('apiKey.delete')
    @ApiKeyAdminDeleteGuard()
    @ApiKeyPublicProtected()
    @RequestParamGuard(ApiKeyRequestDTO)
    @Delete('/delete/:apiKey')
    async delete(@GetApiKey() apiKey: ApiKeyEntity): Promise<void> {
        await this.apiKeyService.delete(apiKey);

        return;
    }
}
