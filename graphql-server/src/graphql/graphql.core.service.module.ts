import { Module } from '@nestjs/common';
import { GraphQLCoreService } from './graphql.core.service';

@Module({
  providers: [GraphQLCoreService],
  exports: [GraphQLCoreService],
})
export class GraphQLServiceCoreModule {}
