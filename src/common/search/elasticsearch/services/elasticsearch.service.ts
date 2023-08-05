import { Injectable } from '@nestjs/common';
import { Client, ApiResponse } from '@elastic/elasticsearch';
import { IElasticsearchService } from '../../interfaces/elasticsearch.service.interface';

@Injectable()
export class ElasticsearchCoreService implements IElasticsearchService {
    private readonly esClient: Client;

    constructor() {
        // Replace with your Elasticsearch server URL and other configuration options if needed
        this.esClient = new Client({ node: 'http://localhost:9200' });
    }

    async getESInfo(): Promise<ApiResponse> {
        return this.esClient.info();
    }

    async indexExist(index: string): Promise<boolean> {
        const response = await this.esClient.indices.exists({ index });
        return response.body;
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

    async deleteDocument(index: string, id: string): Promise<ApiResponse> {
        return this.esClient.delete({ index, id });
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

    async termAggregation(index: string, field: string): Promise<ApiResponse> {
        const query = { aggs: { termAgg: { terms: { field } } } };
        return this.esClient.search({ index, body: query });
    }

    async moreLikeThisQuery(
        index: string,
        id: string,
        fields: string[]
    ): Promise<ApiResponse> {
        const query = {
            query: {
                more_like_this: {
                    fields,
                    like: [{ _index: index, _id: id }],
                    min_term_freq: 1,
                },
            },
        };
        return this.esClient.search({ index, body: query });
    }
}
