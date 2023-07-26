import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { ENUM_LOGGER_ACTION } from '../constants/logger.enum.constant';
import { ILoggerOptions } from '../interfaces/logger.interface';
import { LoggerInterceptor } from '../interceptors/logger.interceptor';
import {
    LOGGER_ACTION_META_KEY,
    LOGGER_OPTIONS_META_KEY,
} from '../constants/logger.constant';

export function Logger(
    action: ENUM_LOGGER_ACTION,
    options?: ILoggerOptions
): MethodDecorator {
    return applyDecorators(
        UseInterceptors(LoggerInterceptor),
        SetMetadata(LOGGER_ACTION_META_KEY, action),
        SetMetadata(LOGGER_OPTIONS_META_KEY, options ?? {})
    );
}
