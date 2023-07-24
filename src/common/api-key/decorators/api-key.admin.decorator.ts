import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { API_KEY_ACTIVE_META_KEY } from '@common/api-key/constants/api-key.constant';
import { ApiKeyActiveGuard } from '@common/api-key/guards/api-key.active.guard';
import { ApiKeyExpiredGuard } from '@common/api-key/guards/api-key.expired.guard';
import { ApiKeyNotFoundGuard } from '@common/api-key/guards/api-key.not-found.guard';
import { ApiKeyPutToRequestGuard } from '@common/api-key/guards/api-key.put-to-request.guard';

export function ApiKeyAdminGetGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(ApiKeyPutToRequestGuard, ApiKeyNotFoundGuard)
    );
}

export function ApiKeyAdminUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            ApiKeyPutToRequestGuard,
            ApiKeyNotFoundGuard,
            ApiKeyActiveGuard,
            ApiKeyExpiredGuard
        ),
        SetMetadata(API_KEY_ACTIVE_META_KEY, [true])
    );
}

export function ApiKeyAdminUpdateResetGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            ApiKeyPutToRequestGuard,
            ApiKeyNotFoundGuard,
            ApiKeyActiveGuard,
            ApiKeyExpiredGuard
        ),
        SetMetadata(API_KEY_ACTIVE_META_KEY, [true])
    );
}

export function ApiKeyAdminUpdateActiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            ApiKeyPutToRequestGuard,
            ApiKeyNotFoundGuard,
            ApiKeyActiveGuard,
            ApiKeyExpiredGuard
        ),
        SetMetadata(API_KEY_ACTIVE_META_KEY, [false])
    );
}

export function ApiKeyAdminUpdateInactiveGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            ApiKeyPutToRequestGuard,
            ApiKeyNotFoundGuard,
            ApiKeyActiveGuard,
            ApiKeyExpiredGuard
        ),
        SetMetadata(API_KEY_ACTIVE_META_KEY, [true])
    );
}

export function ApiKeyAdminDeleteGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(ApiKeyPutToRequestGuard, ApiKeyNotFoundGuard)
    );
}
