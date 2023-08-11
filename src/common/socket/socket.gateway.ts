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

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // Handle client connection
    handleConnection(client: Socket) {
        this.server.emit('connected', `Client ${client.id} connected`);
    }

    // Handle client disconnection
    handleDisconnect(client: Socket) {
        this.server.emit('disconnected', `Client ${client.id} disconnected`);
    }

    @SubscribeMessage(ENUM_SOCKET_MESSAGE_KEY.JOIN_ROOM)
    joinRoom(client: Socket, roomName: string) {
        client.join(roomName);
        client.emit('joinedRoom', `You've joined room ${roomName}`);
    }

    @SubscribeMessage(ENUM_SOCKET_MESSAGE_KEY.SEND_CHAT)
    sendChatMessage(
        client: Socket,
        payload: { roomName: string; message: string }
    ) {
        const { roomName, message } = payload;
        client.to(roomName).emit('chatMessage', { sender: client.id, message });
    }
}
