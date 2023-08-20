import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLCoreService } from './graphql.core.service';
import { GraphQLServiceCoreModule } from './graphql.core.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [GraphQLServiceCoreModule],
      inject: [GraphQLCoreService],
      useFactory: (graphQLCoreService: GraphQLCoreService) =>
        graphQLCoreService.graphqlUseFactory,
    }),
    TypeOrmModule.forRootAsync({
      imports: [GraphQLServiceCoreModule],
      inject: [GraphQLCoreService],
      useFactory: (graphQLCoreService: GraphQLCoreService) =>
        graphQLCoreService.typeOrmUseFactory,
    }),
  ],
})
export class GraphQLCoreModule {}
