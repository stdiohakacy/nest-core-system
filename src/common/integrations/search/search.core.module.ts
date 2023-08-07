import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ElasticsearchCoreModule } from './elasticsearch/elasticsearch.core.module';
import { ElasticsearchCoreFilter } from './elasticsearch/filters/elasticsearch.core.filter';
import { ElasticsearchCoreInterceptor } from './elasticsearch/interceptors/elasticsearch.core.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
    imports: [ConfigModule, ElasticsearchCoreModule],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ElasticsearchCoreFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ElasticsearchCoreInterceptor,
        },
    ],
    exports: [],
})
export class SearchCoreModule {}
