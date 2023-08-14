// socket.gateway.ts
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ENUM_SOCKET_MESSAGE_KEY } from './constants/socket.enum.constant';
import { MessageCreateDTO } from '../../modules/chat/dtos/message.create.dto';
import { CommandBus } from '@nestjs/cqrs';
import { MessageCreateCommand } from 'src/modules/chat/commands/message.create.command';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly commandBus: CommandBus) {}
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        this.server.emit('connected', `Client ${client.id} connected`);
    }

    handleDisconnect(client: Socket) {
        this.server.emit('disconnected', `Client ${client.id} disconnected`);
    }

    @SubscribeMessage(ENUM_SOCKET_MESSAGE_KEY.JOIN_CONVERSATION)
    joinConversation(client: Socket, conversationId: string) {
        client.join(conversationId);
    }

    @SubscribeMessage(ENUM_SOCKET_MESSAGE_KEY.CREATE_MESSAGE)
    async createMessage(client: Socket, message: MessageCreateDTO) {
        const messageCreated = await this.commandBus.execute(
            new MessageCreateCommand(message)
        );

        this.server
            .to(message.conversationId)
            .emit(ENUM_SOCKET_MESSAGE_KEY.CREATED_MESSAGE, messageCreated);
    }
}
