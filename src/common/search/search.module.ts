import { ElasticsearchCoreModule } from './elasticsearch/elasticsearch.core.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [ElasticsearchCoreModule],
    providers: [],
    exports: [ElasticsearchCoreModule],
})
export class SearchCoreModule {}
