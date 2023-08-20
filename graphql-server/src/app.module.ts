import { Module } from '@nestjs/common';
import { GraphQLCoreModule } from './graphql/graphql.core.module';
import { PostModule } from './modules/post/post.module';

const imports = [GraphQLCoreModule, PostModule];

@Module({
  imports,
})
export class AppModule {}
