import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { RequestHelmetMiddleware } from './helmet/request.helmet.middleware';
import { RequestIdMiddleware } from './id/request.id.middleware';
import {
    RequestJsonBodyParserMiddleware,
    RequestRawBodyParserMiddleware,
    RequestTextBodyParserMiddleware,
    RequestUrlencodedBodyParserMiddleware,
} from './body-parser/request.body-parser.middleware';
import { RequestCorsMiddleware } from './cors/request.cors.middleware';
import { RequestVersionMiddleware } from './version/request.version.middleware';
import { RequestUserAgentMiddleware } from './user-agent/request.user-agent.middleware';
import { RequestTimestampMiddleware } from './timestamp/request.timestamp.middleware';
import { RequestTimezoneMiddleware } from './timezone/request.timezone.middleware';

@Module({})
export class RequestMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(
                RequestHelmetMiddleware,
                RequestIdMiddleware,
                RequestJsonBodyParserMiddleware,
                RequestTextBodyParserMiddleware,
                RequestRawBodyParserMiddleware,
                RequestUrlencodedBodyParserMiddleware,
                RequestCorsMiddleware,
                RequestVersionMiddleware,
                RequestUserAgentMiddleware,
                RequestTimestampMiddleware,
                RequestTimezoneMiddleware
            )
            .forRoutes('*');
    }
}
