import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import GraphQLJSON from 'graphql-type-json';
import path, { join } from 'path';
import { formatError } from './format/graphql-error.format';

@Injectable()
export class GraphQLCoreService {
  get graphqlUseFactory():
    | Omit<ApolloDriverConfig, 'driver'>
    | (Promise<Omit<ApolloDriverConfig, 'driver'>> & { uploads: boolean }) {
    return {
      uploads: false,
      resolvers: { JSON: GraphQLJSON },
      autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
      sortSchema: true,
      playground: false,
      ...(process.env.NODE_ENV === 'development' && {
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
      }),
      context: ({ req }) => ({ req }),
      cache: 'bounded',
      formatError,
    };
  }

  get typeOrmUseFactory():
    | TypeOrmModuleOptions
    | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres' as any,
      host: process.env.DATABASE_HOST || '127.0.0.1',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'nest-core-db',
      entities: [join(__dirname, '../modules/**/entities/*.entity{.ts,.js}')],
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
    };
  }
}
