import {
    Module,
    NestModule,
    MiddlewareConsumer,
    forwardRef,
} from '@nestjs/common';
import { AccessTokenValidationMiddleware } from './validation/access-token.validation.middleware';
import { AccessTokenModule } from '../access-token.module';

@Module({
    imports: [forwardRef(() => AccessTokenModule)],
})
export class AccessTokenMiddlewareModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AccessTokenValidationMiddleware).forRoutes('*');
    }
}
