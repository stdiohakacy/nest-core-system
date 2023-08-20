import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ESCoreDocumentService } from './services/elasticsearch.core.document.service';
import { ESCoreSearchService } from './services/elasticsearch.core.search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ESCoreIndexService } from './services/elasticsearch.core.index.service';

const services = [
    ESCoreDocumentService,
    ESCoreSearchService,
    ESCoreDocumentService,
    ESCoreIndexService,
];

@Global()
@Module({
    imports: [
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
    providers: [...services],
    exports: [...services],
})
export class ElasticsearchCoreModule implements OnModuleInit {
    constructor(private readonly esCoreIdxService: ESCoreIndexService) {}
    async onModuleInit() {
        // await this.esCoreIdxService.initIndices();
    }
}
