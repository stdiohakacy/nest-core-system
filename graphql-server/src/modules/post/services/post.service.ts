import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repositoy';
import { OneRepoQuery, RepoQuery } from '../../../graphql/declare/types';
import { PostEntity } from '../entities/post.entity';
import { PostInput } from '../inputs/post.input';

@Injectable()
export class PostService {
  constructor(private readonly postRepo: PostRepository) {}
  getOne(qs: OneRepoQuery<PostEntity>, query?: string) {
    return this.postRepo.getOne(qs, query);
  }

  getMany(qs?: RepoQuery<PostEntity>, query?: string) {
    return this.postRepo.getMany(qs || {}, query);
  }

  async create(input: PostInput): Promise<PostEntity> {
    const post = new PostEntity();
    post.title = input.title;
    post.content = input.content;
    return this.postRepo.save(post);
  }

  createMany(input: PostInput[]): Promise<PostEntity[]> {
    return this.postRepo.save(input);
  }

  async update(id: string, input: PostInput): Promise<PostEntity> {
    const place = await this.postRepo.findOne({ where: { id } });
    return this.postRepo.save({ ...place, ...input });
  }

  async delete(id: string) {
    const { affected } = await this.postRepo.delete({ id });
    return { status: affected > 0 ? 'success' : 'fail' };
  }
}
