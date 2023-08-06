export class ElasticsearchCoreError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ElasticsearchCoreError';
    }
}
