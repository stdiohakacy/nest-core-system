// client.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageCreateDTO } from '../../modules/chat/dtos/message.create.dto';
import { CommandBus } from '@nestjs/cqrs';
import { MessageCreateCommand } from '../../modules/chat/commands/message.create.command';
import { AuthenticatedSocket } from '../pub-sub/socket-state/socket-state.adapter';
import { ENUM_SOCKET_MESSAGE_KEY } from './constants/socket.enum.constant';
import { SocketStateService } from '../pub-sub/socket-state/socket-state.service';
import { UseInterceptors } from '@nestjs/common';
import { RedisPropagatorInterceptor } from '../pub-sub/redis-propagator/redis-propagator.interceptor';

@UseInterceptors(RedisPropagatorInterceptor)
@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly socketStateService: SocketStateService
    ) {}
    @WebSocketServer()
    server: Server;

    handleConnection(client: AuthenticatedSocket) {
        console.log(`Client ${client.id} connected!`);
        if (client.auth) {
            this.socketStateService.add(client.auth.userId, client);
        }
    }

    handleDisconnect(client: AuthenticatedSocket) {
        console.log(`Client ${client.id} disconnected!`);
        this.socketStateService.remove(client.auth.userId, client);
        client.removeAllListeners('disconnect');
    }

    @SubscribeMessage(ENUM_SOCKET_MESSAGE_KEY.JOIN_CONVERSATION)
    joinConversation(client: AuthenticatedSocket, conversationId: string) {
        client.join(conversationId);
    }

    @SubscribeMessage(ENUM_SOCKET_MESSAGE_KEY.CREATE_MESSAGE)
    async createMessage(
        client: AuthenticatedSocket,
        message: MessageCreateDTO
    ) {
        const messageCreated = await this.commandBus.execute(
            new MessageCreateCommand(message)
        );

        this.server
            .to(message.conversationId)
            .emit(ENUM_SOCKET_MESSAGE_KEY.CREATED_MESSAGE, messageCreated);
    }
}
