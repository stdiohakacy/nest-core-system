import { Module } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './repositories/post.repository';
import { PostsSearchService } from './services/post.search.service';
import { SearchModule } from '../../common/search/search.module';
import { PostSearchHandler } from './queries/post.search.query';

const repositories = [PostRepository];
const services = [PostsSearchService];
const queryHandlers = [PostSearchHandler];

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity]), SearchModule],
    exports: [...repositories],
    providers: [...repositories, ...services, ...queryHandlers],
    controllers: [],
})
export class PostModule {}
