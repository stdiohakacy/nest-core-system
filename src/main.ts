import { NestApplication, NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { AppModule } from 'src/app/app.module';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import swaggerInit from './swagger';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { initAdapters } from './adapters.init';
import { AppClusterService } from './cluster';

async function bootstrap() {
    initializeTransactionalContext();
    const app: NestApplication = await NestFactory.create(AppModule);
    initAdapters(app);
    const configService = app.get(ConfigService);
    const databaseUri: string = configService.get<string>('database.host');
    const env: string = configService.get<string>('app.env');
    const port: number = configService.get<number>('app.http.port');
    const globalPrefix: string = configService.get<string>('app.globalPrefix');
    const versioningPrefix: string = configService.get<string>(
        'app.versioning.prefix'
    );
    const version: string = configService.get<string>('app.versioning.version');
    const httpEnable: boolean = configService.get<boolean>('app.http.enable');
    const versionEnable: string = configService.get<string>(
        'app.versioning.enable'
    );
    const jobEnable: boolean = configService.get<boolean>('app.jobEnable');
    const pgAdminHost = configService.get<string>('database.pgadmin.host');
    const pgAdminPort = configService.get<string>('database.pgadmin.port');
    const pgAdminUrl = `http://${pgAdminHost}:${pgAdminPort}}`;
    const minioHost = configService.get<string>(
        'integration.storage.minio.host'
    );
    const minioPortUI = configService.get<string>(
        'integration.storage.minio.portUI'
    );
    const minioUrl = `http://${minioHost}:${minioPortUI}`;
    const rmqHost = configService.get<string>('message-queue.rmq.host');
    const rmqPortUI = configService.get<string>('message-queue.rmq.portUI');
    const rmqUrl = `http://${rmqHost}:${rmqPortUI}`;
    const kibanaHost = configService.get<string>(
        'integration.search.kibana.host'
    );
    const kibanaPort = configService.get<string>(
        'integration.search.kibana.port'
    );
    const kibanaUrl = `http://${kibanaHost}:${kibanaPort}`;
    const isGraphQLEnable = configService.get<boolean>('graphql.isEnable');
    const graphQLUrl = configService.get<string>('graphql.url');
    const logger = new Logger();
    process.env.NODE_ENV = env;
    // Global
    app.setGlobalPrefix(globalPrefix);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    // Versioning
    if (versionEnable) {
        app.enableVersioning({
            type: VersioningType.URI,
            defaultVersion: version,
            prefix: versioningPrefix,
        });
    }

    // Swagger
    await swaggerInit(app);

    // Listen
    await app.listen(port);

    // logger.log(`Environment Variable`, 'NestApplication');
    // logger.log(JSON.parse(JSON.stringify(process.env)), 'NestApplication');
    logger.log(`Job is ${jobEnable}`);
    logger.log(
        `Http is ${httpEnable}, ${
            httpEnable ? 'routes registered' : 'no routes registered'
        }`
    );
    logger.log(`==========================================================`);
    logger.log(`Http versioning is ${versionEnable}`);
    logger.log(`==========================================================`);
    logger.log(`Http Server running on ${await app.getUrl()}`);
    logger.log(`==========================================================`);
    logger.log(`Postgres URI ${databaseUri}`);
    logger.log(`==========================================================`);
    logger.log(`PgAdmin4 UI URI - ${pgAdminUrl}`);
    logger.log(`==========================================================`);
    logger.log(`Minio UI URI - ${minioUrl}`);
    logger.log(`==========================================================`);
    logger.log(`RabbitMQ UI URI - ${rmqUrl}`);
    logger.log(`==========================================================`);
    logger.log(`Kibana UI URI - ${kibanaUrl}`);
    logger.log(`==========================================================`);
    if (isGraphQLEnable) {
        logger.log(`GraphQL UI URI - ${graphQLUrl}`);
        logger.log(
            `==========================================================`
        );
    }
}

AppClusterService.clusterize(bootstrap);
