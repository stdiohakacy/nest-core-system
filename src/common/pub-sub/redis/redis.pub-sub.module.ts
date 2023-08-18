import { Module } from '@nestjs/common';

import { redisProviders } from './redis.pub-sub.providers';
import { RedisService } from './redis.pub-sub.service';

@Module({
    providers: [...redisProviders, RedisService],
    exports: [...redisProviders, RedisService],
})
export class RedisModule {}
