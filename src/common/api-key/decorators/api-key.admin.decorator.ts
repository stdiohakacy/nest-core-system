import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiKeyPutToRequestGuard } from '../guards/api-key.put-to-request.guard';
import { ApiKeyNotFoundGuard } from '../guards/api-key.not-found.guard';
import { ApiKeyActiveGuard } from '../guards/api-key.active.guard';
import { ApiKeyExpiredGuard } from '../guards/api-key.expired.guard';
import { API_KEY_ACTIVE_META_KEY } from '../constants/api-key.constant';

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
