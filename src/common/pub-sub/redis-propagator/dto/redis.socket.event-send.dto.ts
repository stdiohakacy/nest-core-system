import { RedisSocketEventEmitDTO } from './redis.socket.event-emit.dto';

export class RedisSocketEventSendDTO extends RedisSocketEventEmitDTO {
    public readonly userId: string;
    public readonly socketId: string;
}
