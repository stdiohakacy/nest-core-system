import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessTokenEntity } from './entities/access-token.entity';
import { AccessTokenRepository } from './repositories/access-token.repository';
import { MessageMiddlewareModule } from '../../common/message/middleware/message.middleware.module';
import { AccessTokenMiddlewareModule } from './middlewares/access-token.middleware.module';

const repositories = [AccessTokenRepository];

@Module({
    imports: [
        forwardRef(() => AccessTokenMiddlewareModule),
        TypeOrmModule.forFeature([AccessTokenEntity]),
        MessageMiddlewareModule,
    ],
    providers: [...repositories],
    exports: [...repositories],
})
export class AccessTokenModule {}
