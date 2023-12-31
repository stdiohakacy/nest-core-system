import {
    HttpStatus,
    Module,
    UnprocessableEntityException,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ENUM_REQUEST_STATUS_CODE_ERROR } from './constants/request.status-code.constant';
import { IsPasswordMediumConstraint } from './validations/request.is-password-medium.validation';
import { IsPasswordStrongConstraint } from './validations/request.is-password-strong.validation';
import { IsPasswordWeakConstraint } from './validations/request.is-password-weak.validation';
import { IsStartWithConstraint } from './validations/request.is-start-with.validation';
import { MaxGreaterThanEqualConstraint } from './validations/request.max-greater-than-equal.validation';
import { MaxGreaterThanConstraint } from './validations/request.max-greater-than.validation';
import { MinGreaterThanEqualConstraint } from './validations/request.min-greater-than-equal.validation';
import { MinGreaterThanConstraint } from './validations/request.min-greater-than.validation';
import { IsOnlyDigitsConstraint } from './validations/request.only-digits.validation';
import { SafeStringConstraint } from './validations/request.safe-string.validation';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SettingModule } from '../setting/setting.module';
import { RequestTimeoutInterceptor } from './interceptors/request.timeout.interceptor';
import { MinDateTodayConstraint } from './validations/request.min-date-today.validation';
import { MobileNumberAllowedConstraint } from './validations/request.mobile-number-allowed.validation';
import { MaxDateTodayConstraint } from './validations/request.max-date-today.validation';
import { MaxBinaryFileConstraint } from './validations/request.max-binary-file.validation';
import { RequestMiddlewareModule } from './middleware/request.middleware.module';

@Module({
    imports: [
        RequestMiddlewareModule,
        SettingModule,
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                ttl: config.get('request.throttle.ttl'),
                limit: config.get('request.throttle.limit'),
            }),
        }),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestTimeoutInterceptor,
        },
        {
            provide: APP_PIPE,
            useFactory: () =>
                new ValidationPipe({
                    transform: true,
                    skipNullProperties: false,
                    skipUndefinedProperties: false,
                    skipMissingProperties: false,
                    forbidUnknownValues: false,
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                    exceptionFactory: async (errors: ValidationError[]) =>
                        new UnprocessableEntityException({
                            statusCode:
                                ENUM_REQUEST_STATUS_CODE_ERROR.REQUEST_VALIDATION_ERROR,
                            message: 'request.validation',
                            errors,
                        }),
                }),
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        IsPasswordStrongConstraint,
        IsPasswordMediumConstraint,
        IsPasswordWeakConstraint,
        IsStartWithConstraint,
        MaxGreaterThanEqualConstraint,
        MaxGreaterThanConstraint,
        MinGreaterThanEqualConstraint,
        MinGreaterThanConstraint,
        SafeStringConstraint,
        IsOnlyDigitsConstraint,
        MinDateTodayConstraint,
        MobileNumberAllowedConstraint,
        MaxDateTodayConstraint,
        MaxBinaryFileConstraint,
    ],
    exports: [],
})
export class RequestModule {}
