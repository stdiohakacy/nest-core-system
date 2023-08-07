import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ESCoreIndexService {
    constructor(private readonly esService: ElasticsearchService) {}

    async indexExists(index: string): Promise<boolean> {
        try {
            const response = await this.esService.indices.exists({ index });
            return response.body;
        } catch (error) {
            throw new Error('Error checking index existence: ' + error.message);
        }
    }

    async createIndex(index: string, body: any): Promise<any> {
        try {
            const response = await this.esService.indices.create({
                index,
                body,
            });
            return response.body;
        } catch (error) {
            throw new Error('Error creating index: ' + error.message);
        }
    }

    async initIndices() {
        const indices = ['categories', 'products'];
        let body;
        for (const index of indices) {
            const indexExists = await this.indexExists(index);
            if (!indexExists) {
                if (index === 'categories') {
                    body = {
                        mappings: {
                            properties: {
                                name: { type: 'text' },
                                description: { type: 'text' },
                            },
                        },
                        settings: {
                            number_of_shards: 1,
                            number_of_replicas: 1,
                        },
                    };
                } else if (index === 'products') {
                    body = {
                        mappings: {
                            properties: {
                                name: { type: 'text' },
                                category: { type: 'keyword' },
                                price: { type: 'float' },
                                description: { type: 'text' },
                                inStock: { type: 'boolean' },
                                createdDate: { type: 'date' },
                            },
                        },
                        settings: {
                            number_of_shards: 1,
                            number_of_replicas: 1,
                        },
                    };
                }
                await this.createIndex(index, {});
            }
        }
    }

    async deleteIndex(index: string): Promise<any> {
        try {
            const response = await this.esService.indices.delete({ index });
            return response.body;
        } catch (error) {
            throw new Error('Error deleting index: ' + error.message);
        }
    }

    async indexDocument(index: string, id: string, body: any): Promise<any> {
        try {
            const response = await this.esService.index({ index, id, body });
            return response.body;
        } catch (error) {
            throw new Error('Error indexing document: ' + error.message);
        }
    }

    async updateDocument(index: string, id: string, body: any): Promise<any> {
        try {
            const response = await this.esService.update({ index, id, body });
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

    async indexTemplateExists(templateName: string): Promise<boolean> {
        try {
            const response = await this.esService.indices.existsTemplate({
                name: templateName,
            });
            return response.body;
        } catch (error) {
            throw new Error(
                'Error checking index template existence: ' + error.message
            );
        }
    }

    async createIndexTemplate(templateName: string, body: any): Promise<any> {
        try {
            const response = await this.esService.indices.putTemplate({
                name: templateName,
                body,
            });
            return response.body;
        } catch (error) {
            throw new Error('Error creating index template: ' + error.message);
        }
    }

    async deleteIndexTemplate(templateName: string): Promise<any> {
        try {
            const response = await this.esService.indices.deleteTemplate({
                name: templateName,
            });
            return response.body;
        } catch (error) {
            throw new Error('Error deleting index template: ' + error.message);
        }
    }

    async getIndexMapping(index: string): Promise<any> {
        try {
            const response = await this.esService.indices.getMapping({ index });
            return response.body;
        } catch (error) {
            throw new Error('Error getting index mapping: ' + error.message);
        }
    }

    async updateIndexMapping(index: string, body: any): Promise<any> {
        try {
            const response = await this.esService.indices.putMapping({
                index,
                body,
            });
            return response.body;
        } catch (error) {
            throw new Error('Error updating index mapping: ' + error.message);
        }
    }

    async getIndexSettings(index: string): Promise<any> {
        try {
            const response = await this.esService.indices.getSettings({
                index,
            });
            return response.body;
        } catch (error) {
            throw new Error('Error getting index settings: ' + error.message);
        }
    }

    async updateIndexSettings(index: string, body: any): Promise<any> {
        try {
            const response = await this.esService.indices.putSettings({
                index,
                body,
            });
            return response.body;
        } catch (error) {
            throw new Error('Error updating index settings: ' + error.message);
        }
    }

    async getIndexAliases(index: string): Promise<any> {
        try {
            const response = await this.esService.indices.getAlias({
                name: index,
            });
            return response.body;
        } catch (error) {
            throw new Error('Error getting index aliases: ' + error.message);
        }
    }

    async updateIndexAliases(index: string, body: any): Promise<any> {
        try {
            const response = await this.esService.indices.updateAliases({
                body,
            });
            return response.body;
        } catch (error) {
            throw new Error('Error updating index aliases: ' + error.message);
        }
    }
}
