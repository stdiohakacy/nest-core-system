import { PostEntity } from '../entities/post.entity';

export interface IPostRepository {
    search(text: string);
    findByIds(ids: string[]): Promise<PostEntity[]>;
    createMany(data: any): Promise<void>;
    deleteMany(): Promise<void>;
}
