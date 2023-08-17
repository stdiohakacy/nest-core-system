import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { ENUM_MESSAGE_LANGUAGE } from './message/constants/message.enum.constant';
import configs from 'src/configs';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';
import { APP_LANGUAGE } from 'src/app/constants/app.constant';
import { DatabaseOptionsModule } from './database/database.options.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseOptionService } from './database/services/database.options.service';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { MessageModule } from './message/message.module';
import { HelperModule } from './helper/helper.module';
import { PaginationModule } from './pagination/pagination.module';
import { ErrorModule } from './error/error.module';
import { ResponseModule } from './response/response.module';
import { RequestModule } from './request/request.module';
import { SettingModule } from './setting/setting.module';
import { LoggerModule } from './logger/logger.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { DebuggerModule } from './debugger/debugger.module';
import { AuthModule } from './auth/auth.module';
import { IntegrationModule } from './integrations/integration.module';
import { RBACCommonModule } from './rbac/rbac.module';
import { NotificationModule } from './integrations/notification/notification.module';
import { SearchCoreModule } from './integrations/search/search.core.module';
import { MessageQueueModule } from './message-queue/message-queue.module';
import { SocketModule } from './socket/socket.module';
import { PubsubModule } from './pub-sub/pub-sub.module';
@Global()
@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            load: configs,
            isGlobal: true,
            cache: true,
            envFilePath: ['.env'],
            expandVariables: true,
            validationSchema: Joi.object({
                APP_NAME: Joi.string().required(),
                APP_ENV: Joi.string()
                    .valid(...Object.values(ENUM_APP_ENVIRONMENT))
                    .default('development')
                    .required(),
                APP_LANGUAGE: Joi.string()
                    .valid(...Object.values(ENUM_MESSAGE_LANGUAGE))
                    .default(APP_LANGUAGE)
                    .required(),

                HTTP_ENABLE: Joi.boolean().default(true).required(),
                HTTP_HOST: [
                    Joi.string().ip({ version: 'ipv4' }).required(),
                    Joi.valid('localhost').required(),
                ],
                HTTP_PORT: Joi.number().default(3000).required(),
                HTTP_VERSIONING_ENABLE: Joi.boolean().default(true).required(),
                HTTP_VERSION: Joi.number().required(),

                DEBUGGER_HTTP_WRITE_INTO_FILE: Joi.boolean()
                    .default(false)
                    .required(),
                DEBUGGER_HTTP_WRITE_INTO_CONSOLE: Joi.boolean()
                    .default(false)
                    .required(),
                DEBUGGER_SYSTEM_WRITE_INTO_FILE: Joi.boolean()
                    .default(false)
                    .required(),
                DEBUGGER_SYSTEM_WRITE_INTO_CONSOLE: Joi.boolean()
                    .default(false)
                    .required(),

                JOB_ENABLE: Joi.boolean().default(false).required(),

                DATABASE_HOST: Joi.string()
                    .default('mongodb://localhost:27017')
                    .required(),
                DATABASE_NAME: Joi.string().default('ack').required(),
                DATABASE_USER: Joi.string().allow(null, '').optional(),
                DATABASE_PASSWORD: Joi.string().allow(null, '').optional(),
                DATABASE_DEBUG: Joi.boolean().default(false).required(),
                DATABASE_OPTIONS: Joi.string().allow(null, '').optional(),

                AUTH_JWT_SUBJECT: Joi.string().required(),
                AUTH_JWT_AUDIENCE: Joi.string().required(),
                AUTH_JWT_ISSUER: Joi.string().required(),

                AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string()
                    // .alphanum()
                    .min(5)
                    .max(5000)
                    .required(),
                AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string()
                    .default('1d')
                    .required(),

                AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string()
                    // .alphanum()
                    .min(5)
                    .max(5000)
                    .required(),
                AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string()
                    .default('7d')
                    .required(),
                AUTH_JWT_REFRESH_TOKEN_NOT_BEFORE_EXPIRATION: Joi.string()
                    .default('1d')
                    .required(),

                AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean()
                    .default(false)
                    .required(),
                AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string()
                    .allow(null, '')
                    .min(20)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string()
                    .allow(null, '')
                    .min(16)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string()
                    .allow(null, '')
                    .min(20)
                    .max(50)
                    .optional(),
                AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string()
                    .allow(null, '')
                    .min(16)
                    .max(50)
                    .optional(),

                AWS_CREDENTIAL_KEY: Joi.string().allow(null, '').optional(),
                AWS_CREDENTIAL_SECRET: Joi.string().allow(null, '').optional(),
                AWS_S3_REGION: Joi.string().allow(null, '').optional(),
                AWS_S3_BUCKET: Joi.string().allow(null, '').optional(),

                SSO_GOOGLE_CLIENT_ID: Joi.string().allow(null, '').optional(),
                SSO_GOOGLE_CLIENT_SECRET: Joi.string()
                    .allow(null, '')
                    .optional(),
                SSO_GOOGLE_CALLBACK_URL_LOGIN: Joi.string()
                    .allow(null, '')
                    .uri()
                    .optional(),
                SSO_GOOGLE_CALLBACK_URL_SIGN_UP: Joi.string()
                    .allow(null, '')
                    .uri()
                    .optional(),

                TWILIO_ACCOUNT_SID: Joi.string().required(),
                TWILIO_AUTH_TOKEN: Joi.string().required(),
                TWILIO_VERIFICATION_SERVICE_SID: Joi.string().required(),
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        TypeOrmModule.forRootAsync({
            imports: [DatabaseOptionsModule],
            useFactory: (dbOptionService: DatabaseOptionService) => {
                return dbOptionService.createOption();
            },
            inject: [DatabaseOptionService],
            dataSourceFactory: async (options) => {
                if (!options) {
                    throw new Error('Invalid options passed');
                }
                return addTransactionalDataSource(new DataSource(options));
            },
        }),
        DatabaseOptionsModule,
        MessageModule,
        HelperModule,
        PaginationModule,
        ErrorModule,
        ResponseModule,
        RequestModule,
        SettingModule,
        LoggerModule,
        ApiKeyModule,
        IntegrationModule,
        RBACCommonModule,
        NotificationModule,
        SearchCoreModule,
        MessageQueueModule,
        SocketModule,
        PubsubModule,
        DebuggerModule.forRoot(),
        AuthModule.forRoot(),
    ],
    exports: [
        DatabaseOptionsModule,
        MessageModule,
        HelperModule,
        PaginationModule,
        ErrorModule,
        ResponseModule,
        RequestModule,
        SettingModule,
        LoggerModule,
        ApiKeyModule,
        SearchCoreModule,
        IntegrationModule,
        RBACCommonModule,
        NotificationModule,
        SearchCoreModule,
        MessageQueueModule,
        SocketModule,
        PubsubModule,
        DebuggerModule.forRoot(),
        AuthModule.forRoot(),
    ],
})
export class CommonModule {}
