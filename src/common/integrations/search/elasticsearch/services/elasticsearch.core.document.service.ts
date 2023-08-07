import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ESCoreDocumentService {
    constructor(private readonly esService: ElasticsearchService) {}

    async getDocument(index: string, id: string): Promise<any> {
        try {
            const response = await this.esService.get({ index, id });
            return response.body;
        } catch (error) {
            throw new Error('Error getting document: ' + error.message);
        }
    }

    async documentExists(index: string, id: string): Promise<boolean> {
        try {
            const response = await this.esService.exists({ index, id });
            return response.body;
        } catch (error) {
            throw new Error(
                'Error checking document existence: ' + error.message
            );
        }
    }

    async indexDocument(index: string, document: any): Promise<any> {
        try {
            const response = await this.esService.index({
                index,
                body: document,
            });
            return response.body;
        } catch (error) {
            throw new Error('Error indexing document: ' + error.message);
        }
    }

    async updateDocument(index: string, id: string, update: any): Promise<any> {
        try {
            const response = await this.esService.update({
                index,
                id,
                body: { doc: update },
            });
            return response.body;
        } catch (error) {
            throw new Error('Error updating document: ' + error.message);
        }
    }

    async deleteDocument(index: string, id: string): Promise<any> {
        try {
            const response = await this.esService.delete({ index, id });
            return response.body;
        } catch (error) {
            throw new Error('Error deleting document: ' + error.message);
        }
    }

    async bulkIndexDocuments(index: string, documents: any[]): Promise<any> {
        try {
            const body = documents.flatMap((doc) => [
                { index: { _index: index } },
                doc,
            ]);
            const response = await this.esService.bulk({ body });
            return response.body;
        } catch (error) {
            throw new Error('Error bulk indexing documents: ' + error.message);
        }
    }

    async getDocumentsByIds(index: string, ids: string[]): Promise<any[]> {
        try {
            const body = {
                ids: {
                    values: ids,
                },
            };
            const response = await this.esService.search({ index, body });
            return response.body.hits.hits.map((hit) => hit._source);
        } catch (error) {
            throw new Error('Error getting documents by IDs: ' + error.message);
        }
    }
}
