import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { IApiKeyPayload } from '../interfaces/api-key.interface';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import { ApiKeyXApiKeyGuard } from '../guards/x-api-key/api-key.x-api-key.guard';
import { ApiKeyPayloadTypeGuard } from '../guards/payload/api-key.payload.type.guard';
import { API_KEY_TYPE_META_KEY } from '../constants/api-key.constant';
import { ENUM_API_KEY_TYPE } from '../constants/api-key.enum.constant';
import { ApiKeyEntity } from '../../../modules/api-key/entities/api-key.entity';

export const ApiKeyPayload: () => ParameterDecorator = createParamDecorator(
    (data: string, ctx: ExecutionContext): IApiKeyPayload => {
        const { apiKey } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { apiKey: IApiKeyPayload }>();
        return data ? apiKey[data] : apiKey;
    }
);

export function ApiKeyServiceProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(ApiKeyXApiKeyGuard, ApiKeyPayloadTypeGuard),
        SetMetadata(API_KEY_TYPE_META_KEY, [ENUM_API_KEY_TYPE.SERVICE])
    );
}

export function ApiKeyPublicProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(ApiKeyXApiKeyGuard, ApiKeyPayloadTypeGuard),
        SetMetadata(API_KEY_TYPE_META_KEY, [ENUM_API_KEY_TYPE.PUBLIC])
    );
}

export const GetApiKey = createParamDecorator(
    (returnPlain: boolean, ctx: ExecutionContext): any | ApiKeyEntity => {
        const { __apiKey } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __apiKey: ApiKeyEntity }>();
        return returnPlain ? instanceToPlain(__apiKey) : __apiKey;
    }
);
