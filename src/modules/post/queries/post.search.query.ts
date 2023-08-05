import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsSearchService } from '../services/post.search.service';

export class PostSearchQuery implements IQuery {
    constructor(public readonly text: string) {}
}

@QueryHandler(PostSearchQuery)
export class PostSearchHandler implements IQueryHandler<PostSearchQuery> {
    constructor(private readonly postSearchService: PostsSearchService) {}

    async execute({ text }: PostSearchQuery) {
        return await this.postSearchService.search(text);
    }
}
