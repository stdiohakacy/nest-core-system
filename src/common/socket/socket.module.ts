import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { CqrsModule } from '@nestjs/cqrs';
import { PubsubModule } from '../pub-sub/pub-sub.module';
import { SocketStateAdapter } from '../pub-sub/socket-state/socket-state.adapter';

@Module({
    imports: [CqrsModule, PubsubModule],
    providers: [SocketGateway, SocketStateAdapter],
    exports: [SocketGateway],
})
export class SocketModule {}
