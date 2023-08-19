import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

import {
    REDIS_PUBLISHER_CLIENT,
    REDIS_SUBSCRIBER_CLIENT,
} from './redis.pub-sub.constant';

export type RedisClient = Redis;

export const redisProviders: Provider[] = [
    {
        useFactory: (): RedisClient => {
            return new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
            });
        },
        provide: REDIS_SUBSCRIBER_CLIENT,
    },
    {
        useFactory: (): RedisClient => {
            return new Redis({
                host: process.env.REDIS_HOST || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379,
            });
        },
        provide: REDIS_PUBLISHER_CLIENT,
    },
];
