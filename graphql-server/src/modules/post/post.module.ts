import { Module } from '@nestjs/common';
import { TypeOrmExModule } from '../../graphql/decorators/typeorm.module';
import { PostRepository } from './repositories/post.repositoy';
import { PostResolver } from './resolvers/post.resolver';
import { PostService } from './services/post.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([PostRepository])],
  providers: [PostResolver, PostService],
})
export class PostModule {}
