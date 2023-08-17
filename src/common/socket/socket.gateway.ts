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
    // constructor(private readonly commandBus: CommandBus) {}
    constructor(private readonly commandBus: CommandBus) {
        // this.socketStateAdapter.bindClientConnect(this.server, (data) => {
        //     console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        //     console.log(data);
        //     console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        // });
    }
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client ${client.id} connected!`);
        console.log(client);
        // this.socketStateAdapter.bindClientConnect(this.server, (data) => {
        //     console.log(data);
        // });
    }

    handleDisconnect(client: Socket) {
        console.log(`Client ${client.id} disconnected!`);
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
