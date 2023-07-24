import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import {
    DebuggerHttpMiddleware,
    DebuggerHttpResponseMiddleware,
    DebuggerHttpWriteIntoConsoleMiddleware,
    DebuggerHttpWriteIntoFileMiddleware,
} from '@common/debugger/middleware/http/debugger.http.middleware';

@Module({})
export class DebuggerMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer
            .apply(
                DebuggerHttpResponseMiddleware,
                DebuggerHttpMiddleware,
                DebuggerHttpWriteIntoConsoleMiddleware,
                DebuggerHttpWriteIntoFileMiddleware
            )
            .forRoutes('*');
    }
}
