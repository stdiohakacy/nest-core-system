export interface IElasticsearchService {
    getESInfo();

    indexExist(index: string);

    searchDocument(index: string, query: any);

    createIndex(index: string, body: any);

    indexDocument(index: string, document: any);

    updateDocument(index: string, id: string, update: any);

    deleteDocument(index: string, id: string);

    bulkIndexDocuments(index: string, documents: any[]);

    termAggregation(index: string, field: string);

    moreLikeThisQuery(index: string, id: string, fields: string[]);
}
