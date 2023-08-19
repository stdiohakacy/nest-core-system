import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthenticatedSocket } from './socket-state.adapter';

@Injectable()
export class SocketStateService {
    private socketState = new Map<string, Socket[]>();

    remove(userId: string, socket: Socket): boolean {
        const existingSockets = this.socketState.get(userId);
        if (!existingSockets) return true;
        const sockets = existingSockets.filter(
            (socket) => socket.id !== socket.id
        );
        if (!sockets.length) {
            this.socketState.delete(userId);
        } else {
            this.socketState.set(userId, sockets);
        }

        return true;
    }

    add(userId: string, socket: AuthenticatedSocket): boolean {
        const existingSockets = this.socketState.get(userId) || [];
        const sockets = [...existingSockets, socket];
        this.socketState.set(userId, sockets);
        return true;
    }

    get(userId: string): Socket[] {
        return this.socketState.get(userId) || [];
    }

    getAll(): Socket[] {
        const sockets = [];
        this.socketState.forEach((socket) => sockets.push(socket));
        return sockets;
    }
}
