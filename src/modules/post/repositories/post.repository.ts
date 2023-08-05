import { DeleteResult, Repository, InsertResult, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { BaseRepository } from '../../../common/base/repository/base.repository';
import { PostEntity } from '../entities/post.entity';
import { IPostRepository } from '../interfaces/post.repository.interface';
import { PostsSearchService } from '../services/post.search.service';

@Injectable()
export class PostRepository
    extends BaseRepository<PostEntity>
    implements IPostRepository
{
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepo: Repository<PostEntity>,
        private readonly postSearchService: PostsSearchService
    ) {
        super();
    }

    async createMany(data: any): Promise<void> {
        await this.postRepo.save(this.postRepo.create(data));
    }
    async deleteMany(): Promise<void> {
        await this.postRepo.delete({});
    }
    async findByIds(ids: string[]): Promise<PostEntity[]> {
        return await this.postRepo.find({ where: { id: In(ids) } });
    }

    findOneById(id: string) {
        throw new Error('Method not implemented.');
    }
    findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        throw new Error('Method not implemented.');
    }
    create(entity: PostEntity): Promise<InsertResult> {
        throw new Error('Method not implemented.');
    }
    update(entity: Partial<PostEntity>): Promise<PostEntity> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
    truncate(): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }

    async search(text: string) {
        const postSearchResults = await this.postSearchService.search(text);
        const ids = postSearchResults
            .map((postSearchResult) =>
                postSearchResult.hits.hits.map((hit) => hit._source.id)
            )
            .flat();
        if (!ids.length) {
            return [];
        }
        return await this.findByIds(ids);
    }
}
