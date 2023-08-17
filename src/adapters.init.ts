import { INestApplication } from '@nestjs/common';
import { SocketStateAdapter } from './common/pub-sub/socket-state/socket-state.adapter';
import { SocketStateService } from './common/pub-sub/socket-state/socket-state.service';
import { RedisPropagatorService } from './common/pub-sub/redis-propagator/redis-propagator.service';

export const initAdapters = (app: INestApplication): INestApplication => {
    const socketStateService = app.get(SocketStateService);
    const redisPropagatorService = app.get(RedisPropagatorService);
    app.useWebSocketAdapter(
        new SocketStateAdapter(app, socketStateService, redisPropagatorService)
    );

    return app;
};
