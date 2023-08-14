import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [CqrsModule],
    providers: [SocketGateway],
    exports: [SocketGateway],
})
export class SocketModule {}
