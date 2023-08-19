import { Observable } from 'rxjs';
import { RedisSocketEventSendDTO } from '../redis-propagator/dto/redis.socket.event-send.dto';

export interface IRedisService {
    fromEvent<T extends RedisSocketEventSendDTO>(
        eventName: string
    ): Observable<T>;
    publish(channel: string, value: unknown): Promise<number>;
}
