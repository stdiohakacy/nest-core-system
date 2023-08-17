import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from './redis/redis.module';
import { RedisPropagatorModule } from './redis-propagator/redis-propagator.module';
import { SocketStateModule } from './socket-state/socket-state.module';
import { RedisService } from './redis/redis.service';
import { RedisPropagatorService } from './redis-propagator/redis-propagator.service';
import { SocketStateService } from './socket-state/socket-state.service';

@Module({
    imports: [RedisModule, RedisPropagatorModule, SocketStateModule],
    providers: [RedisService, RedisPropagatorService, SocketStateService],
    exports: [
        RedisModule,
        RedisPropagatorModule,
        SocketStateModule,
        RedisService,
        RedisPropagatorService,
        SocketStateService,
    ],
})
export class PubsubModule {}
