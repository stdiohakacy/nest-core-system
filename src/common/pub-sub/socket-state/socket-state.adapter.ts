import {
    INestApplicationContext,
    Injectable,
    WebSocketAdapter,
} from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket, Server } from 'socket.io';
import { SocketStateService } from './socket-state.service';
import { RedisPropagatorService } from '../redis-propagator/redis.propagator.service';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    readonly userId: string;
}

export interface AuthenticatedSocket extends Socket {
    auth: TokenPayload;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
    constructor(
        public readonly app: INestApplicationContext,
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
            const token = (socket?.handshake?.query?.token as string) || '';
            if (!token) {
                socket.auth = null;
                return next();
            }

            const tokenPayload: any = await this.tokenParsed(token);
            socket.auth = { userId: tokenPayload.data.id };
            return next();
        });

        return server;
    }
}
