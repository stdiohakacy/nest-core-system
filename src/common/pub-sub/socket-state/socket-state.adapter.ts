import {
    INestApplicationContext,
    Injectable,
    WebSocketAdapter,
} from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket, Server } from 'socket.io';
import { SocketStateService } from './socket-state.service';
import { RedisPropagatorService } from '../redis-propagator/redis-propagator.service';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    readonly userId: string;
}

export interface AuthenticatedSocket extends Socket {
    auth: TokenPayload;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
    constructor(
        private readonly app: INestApplicationContext,
        private readonly socketStateService: SocketStateService,
        private readonly redisPropagatorService: RedisPropagatorService
    ) {
        super(app);
    }

    private tokenParsed(token: string) {
        return jwt.verify(token, process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY, {
            audience: process.env.AUTH_JWT_AUDIENCE,
            issuer: process.env.AUTH_JWT_ISSUER,
            subject: process.env.AUTH_JWT_SUBJECT,
        });
    }

    public create(port: number, options: ServerOptions): Server {
        const server = super.createIOServer(port, options);
        this.redisPropagatorService.injectSocketServer(server);

        server.use(async (socket: AuthenticatedSocket, next) => {
            const token = socket?.handshake?.query?.token as string;
            const tokenPayload: any = await this.tokenParsed(token);

            if (!token) {
                socket.auth = null;
                return next();
            }

            try {
                // socket.auth = {
                //     userId: tokenPayload.user.id,
                // };
                socket.auth = {
                    userId: '123',
                };

                return next();
            } catch (e) {
                return next(e);
            }
        });

        return server;
    }

    public bindClientConnect(server: Server, callback: Function): void {
        server.on('connection', (socket: AuthenticatedSocket) => {
            if (socket.auth) {
                this.socketStateService.add(socket.auth.userId, socket);

                socket.on('disconnect', () => {
                    this.socketStateService.remove(socket.auth.userId, socket);

                    socket.removeAllListeners('disconnect');
                });
            }

            callback(socket);
        });
    }
}
