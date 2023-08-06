import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchCoreService } from './services/elasticsearch.core.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ElasticsearchCoreExceptionFilter } from './filters/error.elasticsearch.core.filter';
import { ElasticsearchCoreInterceptor } from './interceptors/elasticsearch.interceptor.core';

@Global()
@Module({
    imports: [
        ConfigModule,
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                node: configService.get<string>(
                    'integration.search.elasticsearch.node'
                ),
                auth: {
                    username: configService.get<string>(
                        'integration.search.elasticsearch.username'
                    ),
                    password: configService.get<string>(
                        'integration.search.elasticsearch.password'
                    ),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        ElasticsearchCoreService,
        {
            provide: APP_FILTER,
            useClass: ElasticsearchCoreExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ElasticsearchCoreInterceptor,
        },
    ],
    exports: [ElasticsearchModule, ElasticsearchCoreService],
})
export class ElasticsearchCoreModule implements OnModuleInit {
    constructor(private readonly esCoreService: ElasticsearchCoreService) {}
    async onModuleInit() {
        const isPostIdxExist = await this.esCoreService.isIndexExist('posts');

        if (!isPostIdxExist) {
            const postIdxSetting = {
                mappings: {
                    properties: {
                        title: { type: 'text' },
                        content: { type: 'text' },
                    },
                },
            };
            try {
                await this.esCoreService.createIndex('posts', postIdxSetting);
            } catch (error) {
                console.error(error);
            }
        }
    }
}
