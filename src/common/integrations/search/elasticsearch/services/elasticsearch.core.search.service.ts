import { ApiResponse } from '@elastic/elasticsearch';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ESCoreSearchService {
    constructor(private readonly esService: ElasticsearchService) {}

    // Function to perform a term query for a specific field
    async termQuery(index: string, field: string, value: any): Promise<any[]> {
        try {
            const body = {
                query: {
                    term: {
                        [field]: value,
                    },
                },
            };
            const response = await this.esService.search({ index, body });
            return response.body.hits.hits.map((hit) => hit._source);
        } catch (error) {
            throw new Error('Error performing term query: ' + error.message);
        }
    }

    // Function to perform a range query for a numeric field
    async rangeQuery(
        index: string,
        field: string,
        min: number,
        max: number
    ): Promise<any[]> {
        try {
            const body = {
                query: {
                    range: {
                        [field]: {
                            gte: min,
                            lte: max,
                        },
                    },
                },
            };
            const response = await this.esService.search({ index, body });
            return response.body.hits.hits.map((hit) => hit._source);
        } catch (error) {
            throw new Error('Error performing range query: ' + error.message);
        }
    }

    // Function to perform a prefix query for a field
    async prefixQuery(
        index: string,
        field: string,
        prefix: string
    ): Promise<any[]> {
        try {
            const body = {
                query: {
                    prefix: {
                        [field]: prefix,
                    },
                },
            };
            const response = await this.esService.search({ index, body });
            return response.body.hits.hits.map((hit) => hit._source);
        } catch (error) {
            throw new Error('Error performing prefix query: ' + error.message);
        }
    }

    // Function to perform a wildcard query for a field
    async wildcardQuery(
        index: string,
        field: string,
        wildcard: string
    ): Promise<any[]> {
        try {
            const body = {
                query: {
                    wildcard: {
                        [field]: wildcard,
                    },
                },
            };
            const response = await this.esService.search({ index, body });
            return response.body.hits.hits.map((hit) => hit._source);
        } catch (error) {
            throw new Error(
                'Error performing wildcard query: ' + error.message
            );
        }
    }

    // Function to perform a regular expression query for a field
    async regexQuery(
        index: string,
        field: string,
        regex: string
    ): Promise<any[]> {
        try {
            const body = {
                query: {
                    regexp: {
                        [field]: regex,
                    },
                },
            };
            const response = await this.esService.search({ index, body });
            return response.body.hits.hits.map((hit) => hit._source);
        } catch (error) {
            throw new Error('Error performing regex query: ' + error.message);
        }
    }

    // Function to perform a full-text search query using match
    async fullTextSearch(
        index: string,
        field: string,
        query: string
    ): Promise<any[]> {
        try {
            const body = {
                query: {
                    match: {
                        [field]: query,
                    },
                },
            };
            const response = await this.esService.search({ index, body });
            return response.body.hits.hits.map((hit) => hit._source);
        } catch (error) {
            throw new Error(
                'Error performing full-text search: ' + error.message
            );
        }
    }

    // Function to perform a multi-match query across multiple fields
    async multiMatchQuery(
        index: string,
        fields: string[],
        query: string
    ): Promise<any[]> {
        try {
            const body = {
                query: {
                    multi_match: {
                        fields,
                        query,
                    },
                },
            };
            const response = await this.esService.search({ index, body });
            return response.body.hits.hits.map((hit) => hit._source);
        } catch (error) {
            throw new Error(
                'Error performing multi-match query: ' + error.message
            );
        }
    }

    // Function to perform a phrase search using match_phrase
    async phraseSearch(
        index: string,
        field: string,
        phrase: string
    ): Promise<any[]> {
        try {
            const body = {
                query: {
                    match_phrase: {
                        [field]: phrase,
                    },
                },
            };
            const response = await this.esService.search({ index, body });
            return response.body.hits.hits.map((hit) => hit._source);
        } catch (error) {
            throw new Error('Error performing phrase search: ' + error.message);
        }
    }

    // Function to perform a bool query combining multiple queries
    async boolQuery(
        index: string,
        must?: any[],
        mustNot?: any[],
        should?: any[]
    ): Promise<any[]> {
        try {
            const body = {
                query: {
                    bool: {
                        must: must || [],
                        must_not: mustNot || [],
                        should: should || [],
                    },
                },
            };
            const response = await this.esService.search({ index, body });
            return response.body.hits.hits.map((hit) => hit._source);
        } catch (error) {
            throw new Error('Error performing bool query: ' + error.message);
        }
    }

    async termAggregation(index: string, field: string): Promise<ApiResponse> {
        const body = {
            size: 0,
            aggs: {
                terms_aggregation: {
                    terms: {
                        field,
                    },
                },
            },
        };
        return this.esService.search({ index, body });
    }
    async moreLikeThisQuery(
        index: string,
        id: string,
        fields: string[]
    ): Promise<ApiResponse> {
        const body = {
            query: {
                more_like_this: {
                    fields,
                    like: [{ _index: index, _id: id }],
                    min_term_freq: 1,
                    max_query_terms: 12,
                },
            },
        };
        return this.esService.search({ index, body });
    }

    async nestedInnerHitQuery(index: string, query: any): Promise<ApiResponse> {
        const body = {
            query: {
                nested: {
                    path: 'nested_field',
                    query,
                    inner_hits: {}, // To get the matching nested documents
                },
            },
        };
        return this.esService.search({ index, body });
    }
}
