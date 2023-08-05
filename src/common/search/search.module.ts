import { ElasticsearchCoreModule } from './elasticsearch/elasticsearch.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [ElasticsearchCoreModule],
    providers: [],
    exports: [ElasticsearchCoreModule],
})
export class SearchModule {}
