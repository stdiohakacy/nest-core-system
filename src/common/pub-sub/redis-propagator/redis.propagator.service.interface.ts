import { Server } from 'socket.io';
import { RedisPropagatorService } from './redis.propagator.service';
import { RedisSocketEventSendDTO } from './dto/redis.socket.event-send.dto';
import { RedisSocketEventEmitDTO } from './dto/redis.socket.event-emit.dto';

export interface IRedisPropagatorService {
    injectSocketServer(server: Server): RedisPropagatorService;
    propagateEvent(eventInfo: RedisSocketEventSendDTO): boolean;
    emitToAuthenticated(eventInfo: RedisSocketEventEmitDTO): boolean;
    emitToAll(eventInfo: RedisSocketEventEmitDTO): boolean;
}
