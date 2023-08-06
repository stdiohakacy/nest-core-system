import { Injectable, Logger } from '@nestjs/common';
import { Client, ApiResponse, RequestParams } from '@elastic/elasticsearch';
import { IElasticsearchCoreService } from '../../interfaces/elasticsearch.service.core.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ElasticsearchCoreService implements IElasticsearchCoreService {
    private readonly esClient: Client;
    private readonly logger: Logger;

    constructor(private readonly configService: ConfigService) {
        const node = this.configService.get<string>(
            'integration.search.elasticsearch.node'
        );
        const auth = {
            username: this.configService.get<string>(
                'integration.search.elasticsearch.username'
            ),
            password: this.configService.get<string>(
                'integration.search.elasticsearch.password'
            ),
        };

        this.esClient = new Client({ node, auth });
        this.logger = new Logger(this.constructor.name);
    }

    async getESInfo(): Promise<ApiResponse> {
        return this.esClient.info();
    }

    async isIndexExist(index: string): Promise<boolean> {
        const response = await this.esClient.indices.exists({ index });
        return response.body;
    }

    async getDocumentById(index: string, id: string) {
        return this.esClient.get({ index, id });
    }

    async searchDocument(index: string, query: any): Promise<ApiResponse> {
        return this.esClient.search({ index, body: query });
    }

    async createIndex(index: string, body: any): Promise<ApiResponse> {
        return this.esClient.indices.create({ index, body });
    }

    async indexDocument(index: string, document: any): Promise<ApiResponse> {
        return this.esClient.index({ index, body: document });
    }

    async updateDocument(
        index: string,
        id: string,
        update: any
    ): Promise<ApiResponse> {
        return this.esClient.update({ index, id, body: { doc: update } });
    }

    async updateDocumentWithScript(
        index: string,
        id: string,
        script: string,
        params?: Record<string, any>
    ) {
        const body = {
            script: {
                source: script,
                lang: 'painless',
                params,
            },
        };

        return this.esClient.update({
            index,
            id,
            body,
        });
    }

    async upsertDocument(
        index: string,
        id: string,
        data: any
    ): Promise<Record<string, any>> {
        const { body } = await this.esClient.update({
            index,
            id,
            body: { doc: data, upsert: data },
            refresh: true,
        });

        return body;
    }

    async replaceDocument(
        index: string,
        id: string,
        data: any
    ): Promise<Record<string, any>> {
        const { body } = await this.esClient.index({
            index,
            id,
            body: data,
            refresh: true,
        });

        return body;
    }

    async deleteDocument(index: string, id: string): Promise<ApiResponse> {
        return await this.esClient.delete({
            index,
            id,
            refresh: true,
        });
    }

    async bulkIndexDocuments(
        index: string,
        documents: any[]
    ): Promise<ApiResponse> {
        const body = documents.flatMap((doc) => [
            { index: { _index: index } },
            doc,
        ]);
        return this.esClient.bulk({ refresh: true, body });
    }

    async updateByQuery(
        index: string,
        query: any,
        source: any,
        params?: any
    ): Promise<ApiResponse<Record<string, any>, unknown>> {
        let script = {
            source,
            lang: 'painless',
        };

        if (params) {
            script = {
                ...script,
                ...params,
            };
        }

        return await this.esClient.updateByQuery({
            index,
            body: { script, query },
            refresh: true,
        });
    }

    async deleteByQuery(index: string, query: object): Promise<ApiResponse> {
        const response: ApiResponse = await this.esClient.deleteByQuery({
            index,
            body: { query },
            refresh: true,
        });

        return response;
    }

    async batchIndexDocuments(
        index: string,
        documents: object[],
        batchSize: number
    ): Promise<void> {
        // Create an array to store batched documents
        const batches: any[][] = [];

        // Split the documents into batches
        for (let i = 0; i < documents.length; i += batchSize) {
            batches.push(documents.slice(i, i + batchSize));
        }

        // Create an array to store bulk request actions
        const bulkActions: any[] = [];

        // Iterate through each batch and create bulk actions
        for (const batch of batches) {
            // Create 'index' actions for each document in the batch
            for (const doc of batch) {
                bulkActions.push({ index: { _index: index, _id: doc.id } });
                bulkActions.push(doc);
            }

            // Use the Elasticsearch client's 'bulk' method to perform the batch indexing
            const response: ApiResponse = await this.esClient.bulk({
                body: bulkActions,
            });

            // Clear the bulk actions array for the next batch
            bulkActions.length = 0;

            // Handle the response as needed (e.g., log the results)
            this.logger.log('Batch Processing Result:', response);

            // Add a delay (optional) to avoid overwhelming the Elasticsearch cluster
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    async getMapping(
        index: string
    ): Promise<ApiResponse<Record<string, any>, unknown>> {
        return await this.esClient.indices.getMapping({ index });
    }

    async reIndexData(
        sourceIndex: string,
        targetIndex: string
    ): Promise<ApiResponse<Record<string, any>, unknown>> {
        return await this.esClient.reindex({
            body: {
                source: { index: sourceIndex },
                dest: { index: targetIndex },
            },
        });
    }

    async createIndexTemplate(
        templateName: string,
        body: any
    ): Promise<Record<string, any>> {
        const response = await this.esClient.indices.putTemplate({
            name: templateName,
            body,
        });
        return response.body;
    }

    async indexESCData(index: string, data: any): Promise<Record<string, any>> {
        const response = await this.esClient.index({ index, body: data });
        return response.body;
    }

    async addAnalyzersToIndex(
        index: string,
        analyzers: any
    ): Promise<Record<string, any>> {
        const params: RequestParams.IndicesPutSettings = {
            index,
            body: {
                settings: {
                    analysis: analyzers,
                },
            },
        };

        const response = await this.esClient.indices.putSettings(params);
        return response.body;
    }

    async searchByTerm(
        index: string,
        field: string,
        term: string
    ): Promise<any> {
        const query = {
            query: { term: { [field]: term } },
        };

        const { body } = await this.esClient.search({ index, body: query });
        return body.hits.hits;
    }

    async getDocumentsByIds(index: string, ids: string[]): Promise<any> {
        const { body } = await this.esClient.mget({ index, body: { ids } });
        return body.docs;
    }

    async searchByRange(
        index: string,
        field: string,
        min: number,
        max: number
    ): Promise<any> {
        const { body } = await this.esClient.search({
            index,
            body: {
                query: {
                    range: {
                        [field]: {
                            gte: min,
                            lte: max,
                        },
                    },
                },
            },
        });

        return body.hits.hits;
    }

    async searchByType(
        index: string,
        field: string,
        searchType: string,
        searchValue: string
    ): Promise<any> {
        const query = {
            query: {
                [searchType]: { [field]: searchValue },
            },
        };

        const { body } = await this.esClient.search({ index, body: query });
        return body.hits.hits;
    }

    async fullTextSearch(
        index: string,
        field: string,
        searchText: string
    ): Promise<any> {
        const query = {
            query: {
                match: {
                    [field]: searchText,
                },
            },
        };

        const { body } = await this.esClient.search({ index, body: query });
        return body.hits.hits;
    }

    async multiMatchSearch(
        index: string,
        queryText: string,
        fields: string[]
    ): Promise<any> {
        const body = {
            query: { multi_match: { query: queryText, fields: fields } },
        };
        const response = await this.esClient.search({ index, body });
        return response.body.hits.hits;
    }

    async searchByPhrase(index: string, field: string, phrase: string) {
        const query = {
            query: {
                match_phrase: {
                    [field]: phrase,
                },
            },
        };

        const result = await this.esClient.search({ index, body: query });
        return result.body.hits.hits;
    }

    async searchByLeafQuery(
        index: string,
        field: string,
        value: string,
        queryType: string
    ) {
        let query;

        switch (queryType) {
            case 'match':
                query = {
                    query: {
                        match: {
                            [field]: value,
                        },
                    },
                };
                break;
            case 'term':
                query = {
                    query: {
                        term: {
                            [field]: value,
                        },
                    },
                };
                break;
            case 'range':
                // Assuming value is in the format "start-end", e.g., "10-100".
                const [start, end] = value.split('-');
                query = {
                    query: {
                        range: {
                            [field]: {
                                gte: start,
                                lte: end,
                            },
                        },
                    },
                };
                break;
            case 'prefix':
                query = {
                    query: {
                        prefix: {
                            [field]: value,
                        },
                    },
                };
                break;
            case 'wildcard':
                query = {
                    query: {
                        wildcard: {
                            [field]: value,
                        },
                    },
                };
                break;
            case 'regexp':
                query = {
                    query: {
                        regexp: {
                            [field]: value,
                        },
                    },
                };
                break;
            default:
                throw new Error(
                    'Invalid query type. Supported values: "match", "term", "range", "prefix", "wildcard", "regexp".'
                );
        }

        const result = await this.esClient.search({ index, body: query });
        return result.body.hits.hits;
    }

    async searchByCompoundQuery(index: string, compoundQuery: any) {
        const query = { query: compoundQuery };
        const result = await this.esClient.search({ index, body: query });
        return result.body.hits.hits;
    }

    async boostingQuery(
        positiveTerm: string,
        negativeTerm: string,
        field: string
    ): Promise<any> {
        const query = {
            query: {
                boosting: {
                    positive: { term: { [field]: positiveTerm } },
                    negative: { term: { [field]: negativeTerm } },
                    negative_boost: 0.5,
                },
            },
        };

        try {
            const response = await this.esClient.search({
                index: 'products',
                body: query,
            });
            return response.body;
        } catch (error) {
            throw new Error(
                'Error executing the Boosting query: ' + error.message
            );
        }
    }

    async searchWithDisjunctionMax(
        index: string,
        queryText: string,
        fields: string[]
    ) {
        const query = {
            query: {
                dis_max: {
                    queries: fields.map((field) => ({
                        match: {
                            [field]: queryText,
                        },
                    })),
                },
            },
        };

        return this.esClient.search({ index, body: query });
    }

    async searchWithNestedQuery(index: string, nestedQuery: object) {
        const query = { query: nestedQuery };

        return this.esClient.search({ index, body: query });
    }
}
