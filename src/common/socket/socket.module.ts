import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { CqrsModule } from '@nestjs/cqrs';
import { PubsubModule } from '../pub-sub/pub-sub.module';

@Module({
    imports: [CqrsModule, PubsubModule],
    providers: [SocketGateway],
    exports: [SocketGateway],
})
export class SocketModule {}
