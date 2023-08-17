import { Module } from '@nestjs/common';
import { RedisPropagatorService } from './redis-propagator.service';
import { RedisModule } from '../redis/redis.module';
import { SocketStateService } from '../socket-state/socket-state.service';

@Module({
    imports: [RedisModule],
    providers: [RedisPropagatorService, SocketStateService],
    exports: [RedisPropagatorService, SocketStateService],
})
export class RedisPropagatorModule {}
