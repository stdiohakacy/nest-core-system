import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PostEntity } from '../entities/post.entity';
import { IPostSearchResult } from '../interfaces/post.interface';

@Injectable()
export class PostsSearchService {
    index = 'posts';

    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    async indexPost(post: PostEntity) {
        return this.elasticsearchService.index({
            index: this.index,
            body: {
                id: post.id,
                title: post.title,
                content: post.content,
            },
        });
    }

    async search(text: string) {
        let body = null;
        try {
            body = await this.elasticsearchService.search<IPostSearchResult>({
                index: this.index,
                body: {
                    query: {
                        multi_match: {
                            query: text,
                            fields: ['title', 'content'],
                        },
                    },
                },
            });
        } catch (error) {
            console.error('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            console.error(error);
            console.error('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        }

        const hits = body.hits.hits;
        const result = hits.map((item) => item._source);
        return result;
    }
}
