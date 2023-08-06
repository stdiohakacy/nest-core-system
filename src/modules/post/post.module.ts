import { Module } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './repositories/post.repository';
import { PostsSearchService } from './services/post.search.service';
import { PostSearchHandler } from './queries/post.search.query';
import { SearchCoreModule } from 'src/common/search/search.module';

const repositories = [PostRepository];
const services = [PostsSearchService];
const queryHandlers = [PostSearchHandler];

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity]), SearchCoreModule],
    exports: [...repositories],
    providers: [...repositories, ...services, ...queryHandlers],
    controllers: [],
})
export class PostModule {}
