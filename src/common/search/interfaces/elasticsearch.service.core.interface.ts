import { ApiResponse } from '@elastic/elasticsearch';

export interface IElasticsearchCoreService {
    getESInfo();

    isIndexExist(index: string);

    bulkIndexDocuments(index: string, documents: any[]): Promise<ApiResponse>;

    searchDocument(index: string, query: any);

    getDocumentById(index: string, id: string);

    createIndex(index: string, body: any);

    indexDocument(index: string, document: any);

    updateDocument(index: string, id: string, update: any);

    /**
     * Update a document using a scripted update in Elasticsearch.
     *
     * @param index - The name of the index containing the document.
     * @param id - The ID of the document to update.
     * @param script - The Painless script to apply for the update.
     * @param params - Optional parameters used in the Painless script.
     * @returns Promise<ApiResponse> - A promise that resolves to the Elasticsearch API response.
     *
     * @example
     * // Example of updating a product's price using a scripted update
     * const index = 'products'; // Replace with the actual index name
     * const id = '1'; // Replace with the ID of the product document to update
     * const script = 'ctx._source.price += params.increment'; // The Painless script to update the price
     * const params = { increment: 100 }; // Parameter for the script, in this case, the increment value
     * const response = await updateDocumentWithScript(index, id, script, params);
     * console.log(response.body); // Log the Elasticsearch API response
     */
    updateDocumentWithScript(
        index: string,
        id: string,
        script: string,
        params?: Record<string, any>
    ): Promise<ApiResponse<Record<string, any>, unknown>>;

    /**
     * When: Use if want to avoid separate logic for checking whether a document exists before performing an update or insert operation. It is particularly helpful when dealing with a large number of documents or when handling concurrent updates from multiple clients.
     
     * Upserts a document in Elasticsearch.
     * If the document with the specified ID exists, it will be updated with the new data.
     * If the document does not exist, a new document will be inserted with the provided data.
     *
     * @param {string} index - The name of the Elasticsearch index.
     * @param {string} id - The ID of the document to upsert.
     * @param {Object} data - The data to be upserted.
     * @returns {Promise<Object>} - A promise that resolves to the upsert result.
     * @throws {Error} - If there is an error in upserting the document.
     */
    upsertDocument(
        index: string,
        id: string,
        data: any
    ): Promise<Record<string, any>>;

    /**
     * When: Entire document needs to be updated or when you want to enforce strict data integrity by deleting the old document before inserting a new one.
     *
     * Replaces a document in Elasticsearch.
     * If the document with the specified ID exists, it will be replaced with the new data.
     * If the document does not exist, a new document will be inserted with the provided data.
     *
     * @param {string} index - The name of the Elasticsearch index.
     * @param {string} id - The ID of the document to replace.
     * @param {Object} data - The data to be used for replacement.
     * @returns {Promise<Object>} - A promise that resolves to the result of the replacement operation.
     * @throws {Error} - If there is an error during the replacement process.
     */
    replaceDocument(
        index: string,
        id: string,
        data: any
    ): Promise<Record<string, any>>;

    /**
     * Deletes a document from Elasticsearch.
     *
     * @param {string} index - The name of the Elasticsearch index.
     * @param {string} id - The ID of the document to be deleted.
     * @returns {Promise<ApiResponse>} - A promise that resolves to the delete result.
     * @throws {Error} - If there is an error during the deletion process.
     */
    deleteDocument(index: string, id: string): Promise<ApiResponse>;

    /**
     * When you want to modify specific documents in bulk.
     * When you need to update documents based on certain conditions.
     * When you want to reindex or apply changes across a large dataset without retrieving and updating each document individually.
     *
     * @param {string} index - The name of the Elasticsearch index.
     * @param {Object} query - The query to identify the documents to be updated.
     * @param {Object} update - The changes to be applied to the matching documents.
     * @returns {Promise<ApiResponse>} - A promise that resolves to the update result.
     * @throws {Error} - If there is an error during the update by query process.
     */
    updateByQuery(
        index: string,
        query: any,
        source: any,
        params?: any
    ): Promise<ApiResponse<Record<string, any>, unknown>>;

    /**
     * When: Used when need to perform bulk deletions of documents that match a particular query. It is helpful in scenarios want to remove a subset of documents from a large index without affecting other data.
     *
     * @param {string} index - The name of the Elasticsearch index.
     * @param {Object} query - The query to identify the documents to be deleted.
     * @returns {Promise<ApiResponse>} - A promise that resolves to the delete result.
     * @throws {Error} - If there is an error during the delete by query process.
     */
    deleteByQuery(index: string, query: object): Promise<ApiResponse>;

    /**
     * Suitable for situations where data is collected over time and can be processed periodically or at specific intervals. It is commonly used in data warehousing, ETL (extract, transform, load) processes, data analytics, and bulk data updates.
     *
     * @param {string} index - The name of the Elasticsearch index where documents will be indexed.
     * @param {Object[]} documents - An array of objects representing the documents to be indexed.
     * @param {number} batchSize - The size of each batch for indexing.
     * @returns {Promise<ApiResponse>} - A promise that resolves to the batch processing result.
     * @throws {Error} - If there is an error during the batch processing.
     */
    batchIndexDocuments(
        index: string,
        documents: object[],
        batchSize: number
    ): Promise<void>;

    /**
     * Retrieve the mapping for a specific index in Elasticsearch.
     *
     * @param {string} index - The name of the Elasticsearch index.
     * @returns {Promise<ApiResponse>} - A promise that resolves to the mapping result.
     * @throws {Error} - If there is an error in retrieving the mapping.
     */
    getMapping(
        index: string
    ): Promise<ApiResponse<Record<string, any>, unknown>>;

    /**
     * Use the Reindex API when need to perform large-scale data transformations or migrations, consolidate data from multiple indices into a single index, or when want to restructure your data to match a new mapping or schema
     *
     * @param {string} sourceIndex - The name of the source index.
     * @param {string} targetIndex - The name of the target index.
     * @returns {Promise<ApiResponse>} - A promise that resolves to the reindex response.
     * @throws {Error} - If there is an error in the reindex process.
     */
    reIndexData(
        sourceIndex: string,
        targetIndex: string
    ): Promise<ApiResponse<Record<string, any>, unknown>>;

    /**
     * Use the Create Index Template function when you need to create new indices frequently with similar mappings and settings. It is especially useful when dealing with time-based data, where you want to create new indices regularly (e.g., daily or monthly) while maintaining a consistent structure.
     *
     * @param {string} templateName - The name of the index template to be created.
     * @param {Object} body - The configuration for the index template, including index patterns, mappings, and settings.
     * @returns {Promise<Object>} - A promise that resolves to the Elasticsearch response for creating the index template.
     * @throws {Error} - If there is an error in creating the index template.
     *
     * Example:
     * const templateName = 'my_index_template';
     * const templateBody = {
     *   index_patterns: ['my_index_*'],
     *   mappings: {
     *     properties: {
     *       '@timestamp': { type: 'date' },
     *       'event.category': { type: 'keyword' },
     *       'event.action': { type: 'keyword' },
     *       'user.name': { type: 'keyword' },
     *       'source.ip': { type: 'ip' },
     *       'user_agent.name': { type: 'text' },
     *       // Add more fields as needed
     *     },
     *   },
     *   settings: {
     *     number_of_shards: 1,
     *     number_of_replicas: 1,
     *   },
     * };
     */
    createIndexTemplate(
        templateName: string,
        body: any
    ): Promise<Record<string, any>>;

    /**
     * Index Elasticsearch Common Schema (ECS) data into the specified index.
     * This function is used to add ECS-compliant documents to an Elasticsearch index.
     *
     * @param {string} index - The name of the Elasticsearch index where the data will be indexed.
     * @param {any} data - The ECS-compliant data to be indexed into Elasticsearch.
     * @returns {Promise<Record<string, any>>} - A promise that resolves to the Elasticsearch response containing information about the indexed document.
     * @throws {Error} - If there is an error in indexing the data.
     *
     * Example:
     * const indexName = 'my_ecs_index';
     * const ecsData = {
     *   '@timestamp': '2023-07-30T12:34:56.789Z',
     *   'event.category': 'authentication',
     *   'event.action': 'login',
     *   'user.name': 'john_doe',
     *   'source.ip': '192.168.1.100',
     *   'user_agent.name': 'Mozilla Firefox',
     *   // Add more ECS fields as needed
     * };
     */
    indexESCData(index: string, data: any): Promise<Record<string, any>>;

    /**
     * Adds analyzers to an existing Elasticsearch index.
     *
     * @param {string} index - The name of the existing Elasticsearch index.
     * @param {Object} analyzers - The analyzers configuration to be added to the index.
     * @returns {Promise<Record<string, any>>} - A promise that resolves to the Elasticsearch response containing information about the index update.
     * @throws {Error} - If there is an error in updating the index with analyzers.
     *
     * Example:
     * const indexName = 'my_existing_index';
     * const analyzersConfig = {
     *   analyzer: {
     *     my_custom_analyzer: {
     *       type: 'custom',
     *       tokenizer: 'standard',
     *       filter: ['lowercase', 'my_custom_filter'],
     *     },
     *   },
     *   filter: {
     *     my_custom_filter: {
     *       type: 'ngram',
     *       min_gram: 2,
     *       max_gram: 5,
     *     },
     *   },
     * };
     */
    addAnalyzersToIndex(
        index: string,
        analyzers: any
    ): Promise<Record<string, any>>;

    /**
     * Search for documents in the specified Elasticsearch index that match a given term in a specific field.
     *
     * @param {string} index - The name of the Elasticsearch index to search in.
     * @param {string} field - The name of the field to search in.
     * @param {string} term - The term to search for in the specified field.
     * @returns {Promise<any>} - A promise that resolves to an array of documents that match the search term.
     * @throws {Error} - If there is an error in performing the search.
     *
     * Example usage:
     * const indexName = 'my_index';
     * const fieldName = 'product_name';
     * const searchTerm = 'electronics';
     * const searchResults = await this.searchByTerm(indexName, fieldName, searchTerm);
     * console.log(searchResults);
     */
    searchByTerm(index: string, field: string, term: string): Promise<any>;

    /**
     * Retrieve documents from the specified Elasticsearch index by their IDs.
     *
     * @param {string} index - The name of the Elasticsearch index to retrieve documents from.
     * @param {string[]} ids - An array of document IDs to retrieve.
     * @returns {Promise<any>} - A promise that resolves to an array of documents that match the specified IDs.
     * @throws {Error} - If there is an error in retrieving the documents.
     *
     * Example usage:
     * const indexName = 'my_index';
     * const documentIds = ['1', '2', '3'];
     * const documents = await this.getDocumentsByIds(indexName, documentIds);
     * console.log(documents);
     */
    getDocumentsByIds(index: string, ids: string[]): Promise<any>;

    /**
     * Perform a range search in the specified Elasticsearch index based on a numeric field.
     *
     * @param {string} index - The name of the Elasticsearch index to perform the range search on.
     * @param {string} field - The name of the numeric field to perform the range search on.
     * @param {number} min - The minimum value for the range (inclusive).
     * @param {number} max - The maximum value for the range (inclusive).
     * @returns {Promise<any>} - A promise that resolves to the Elasticsearch response for the range search.
     * @throws {Error} - If there is an error in performing the range search.
     *
     * Example usage:
     * const indexName = 'my_index';
     * const fieldName = 'price';
     * const minPrice = 100;
     * const maxPrice = 500;
     * const results = await this.rangeSearch(indexName, fieldName, minPrice, maxPrice);
     * console.log(results);
     */
    searchByRange(
        index: string,
        field: string,
        min: number,
        max: number
    ): Promise<any>;

    /**
     * Perform a search in the specified Elasticsearch index based on a text field using the specified search type.
     *
     * @param {string} index - The name of the Elasticsearch index to perform the search on.
     * @param {string} field - The name of the text field to perform the search on.
     * @param {string} searchType - The type of search to perform (prefix, wildcard, or regex).
     * @param {string} searchValue - The search value based on the chosen search type.
     * @returns {Promise<any>} - A promise that resolves to the Elasticsearch response for the search.
     * @throws {Error} - If there is an error in performing the search.
     *
     * Example usage:
     * const indexName = 'my_index';
     * const fieldName = 'name';
     * const prefix = 'john';
     * const results = await this.searchByType(indexName, fieldName, 'prefix', prefix);
     * console.log(results);
     */
    searchByType(
        index: string,
        field: string,
        searchType: string,
        searchValue: string
    ): Promise<any>;

    /**
     * Perform a full text search in the specified Elasticsearch index based on a text field.
     *
     * @param {string} index - The name of the Elasticsearch index to perform the search on.
     * @param {string} field - The name of the text field to perform the search on.
     * @param {string} searchText - The search text for the full text search.
     * @returns {Promise<any>} - A promise that resolves to the Elasticsearch response for the full text search.
     * @throws {Error} - If there is an error in performing the full text search.
     *
     * Example usage:
     * const indexName = 'my_index';
     * const fieldName = 'description';
     * const searchText = 'Elasticsearch is a powerful search engine';
     * const results = await this.fullTextSearch(indexName, fieldName, searchText);
     * console.log(results);
     */
    fullTextSearch(
        index: string,
        field: string,
        searchText: string
    ): Promise<any>;

    /**
     * Performs a full-text search across multiple fields using the multi_match query.
     * Use the multi_match query when you have a user query that you want to search across multiple fields in your documents to find the best matches.
     *
     * @param {string} index - The name of the Elasticsearch index to search in.
     * @param {string} queryText - The user's search input.
     * @param {string[]} fields - An array of field names to search in.
     * @returns {Promise<any[]>} - A promise that resolves to an array of matching documents.
     * @throws {Error} - If there is an error in performing the search.
     *
     * Example:
     * const indexName = 'my_index';
     * const userQuery = 'Elasticsearch tutorial';
     * const searchFields = ['title^3', 'description^2', 'content'];
     *
     * const searchResults = await this.myElasticsearchService.multiMatchSearch(indexName, userQuery, searchFields);
     * console.log(searchResults);
     */
    multiMatchSearch(
        index: string,
        queryText: string,
        fields: string[]
    ): Promise<any>;

    /**
     * Search documents in the specified Elasticsearch index using the "match_phrase" query.
     * Use a phrase search when need to narrow down search results to documents that contain a specific phrase, ensuring the words appear in the exact order as queried.
     *
     * @param {string} index - The name of the Elasticsearch index to search in.
     * @param {string} field - The field in which to search for the phrase.
     * @param {string} phrase - The exact phrase to search for.
     * @returns {Promise<any[]>} - A promise that resolves to an array of documents matching the phrase search.
     * @throws {Error} - If there is an error in performing the search.
     * @example
     * // Searching for the phrase "Elasticsearch tutorial" in the "content" field of the "my_index" index.
     * const indexName = 'my_index';
     * const fieldToSearch = 'content';
     * const searchPhrase = 'Elasticsearch tutorial';
     *
     * const searchResults = await myElasticsearchService.searchByPhrase(indexName, fieldToSearch, searchPhrase);
     * console.log(searchResults);
     */
    searchByPhrase(index: string, field: string, phrase: string): Promise<any>;

    /**
     * Search documents in the specified Elasticsearch index using a leaf query.
     *
     * @param {string} index - The name of the Elasticsearch index to search in.
     * @param {string} field - The field to search for.
     * @param {string} value - The value to search for in the specified field.
     * @param {string} queryType - The type of query to use. Supported values: "match", "term", "range", "prefix", "wildcard", "regexp".
     * @returns {Promise<any[]>} - A promise that resolves to an array of documents matching the leaf query.
     * @throws {Error} - If there is an error in performing the search.
     * @example
     * // Searching for documents where the "title" field matches the value "Elasticsearch" in the "my_index" index.
     * const indexName = 'my_index';
     * const fieldName = 'title';
     * const queryValue = 'Elasticsearch';
     * const queryType = 'match';
     *
     * const searchResults = await myElasticsearchService.searchByLeafQuery(indexName, fieldName, queryValue, queryType);
     * console.log(searchResults);
     */
    searchByLeafQuery(
        index: string,
        field: string,
        value: string,
        queryType: string
    ): Promise<any>;

    /**
     * Search documents in the specified Elasticsearch index using a compound query.
     *
     * @param {string} index - The name of the Elasticsearch index to search in.
     * @param {Object} compoundQuery - The compound query to use for searching.
     * @returns {Promise<any[]>} - A promise that resolves to an array of documents matching the compound query.
     * @throws {Error} - If there is an error in performing the search.
     * @example
     * // Searching for documents where the "title" field matches "Elasticsearch" and the "category" field is "Software" in the "my_index" index.
     * const indexName = 'my_index';
     * const compoundQuery = {
     *   bool: {
     *     must: [
     *       { match: { title: 'Elasticsearch' } },
     *       { term: { category: 'Software' } }
     *     ],
     *   },
     * };
     *
     * const searchResults = await myElasticsearchService.searchByCompoundQuery(indexName, compoundQuery);
     * console.log(searchResults);
     */
    searchByCompoundQuery(index: string, compoundQuery: any): Promise<any>;

    /**
     * Perform a Boosting query to influence the relevance scoring of search results.
     *
     * @param {string} positiveTerm - The term to be boosted (given higher relevance).
     * @param {string} negativeTerm - The term to be reduced in relevance.
     * @param {string} field - The field in which to search for the terms.
     * @returns {Promise<Object>} - A promise that resolves to the Elasticsearch response with search results.
     * @throws {Error} - If there is an error in executing the Boosting query.
     * Example:
     * const positiveTerm = 'apple';
     * const negativeTerm = 'banana';
     * const field = 'product_name';
     * const searchResults = await this.boostingQuery(positiveTerm, negativeTerm, field);
     */
    boostingQuery(
        positiveTerm: string,
        negativeTerm: string,
        field: string
    ): Promise<any>;

    /**
     * Performs a search in Elasticsearch using the Disjunction Max (dis_max) query.
     * The Disjunction Max query is used to search across multiple fields, and the relevance score for each document is determined
     * based on the maximum relevance score among the individual field queries.
     *
     * @param {string} index - The name of the Elasticsearch index to search.
     * @param {string} queryText - The search query text to be used in the Disjunction Max query.
     * @param {string[]} fields - An array of field names in which to perform the search.
     * @returns {Promise<Object>} - A promise that resolves to the Elasticsearch response containing the search results.
     * @throws {Error} - If there is an error in performing the search.
     *
     * Example usage:
     * const index = 'products';
     * const queryText = 'Elasticsearch';
     * const fields = ['title', 'description', 'category'];
     * const esService = new MyElasticsearchService();
     * const searchResult = await esService.searchWithDisjunctionMax(index, queryText, fields);
     * console.log('Search Result:', searchResult.body.hits.hits);
     */
    searchWithDisjunctionMax(
        index: string,
        queryText: string,
        fields: string[]
    ): Promise<ApiResponse<Record<string, any>, unknown>>;

    /**
     * Performs a search in Elasticsearch for documents containing a nested object that matches the specified query.
     *
     * @param {string} index - The name of the Elasticsearch index to search.
     * @param {Object} nestedQuery - The nested query to be used in the search.
     * @returns {Promise<Object>} - A promise that resolves to the Elasticsearch response containing the search results.
     * @throws {Error} - If there is an error in performing the search.
     *
     * Example usage:
     * const index = 'products';
     * const nestedQuery = {
     *   nested: {
     *     path: 'attributes',
     *     query: {
     *       bool: {
     *         must: [
     *           { match: { 'attributes.name': 'color' } },
     *           { match: { 'attributes.value': 'red' } }
     *         ],
     *       },
     *     },
     *   },
     * };
     * const esService = new MyElasticsearchService();
     * const searchResult = await esService.searchWithNestedQuery(index, nestedQuery);
     * console.log('Search Result:', searchResult.body.hits.hits);
     */
    searchWithNestedQuery(
        index: string,
        nestedQuery: object
    ): Promise<ApiResponse<Record<string, any>, unknown>>;
}
