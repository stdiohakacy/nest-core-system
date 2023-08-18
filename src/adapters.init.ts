import { INestApplication } from '@nestjs/common';
import { SocketStateAdapter } from './common/pub-sub/socket-state/socket-state.adapter';
import { RedisPropagatorService } from './common/pub-sub/redis-propagator/redis-propagator.service';

export const initAdapters = (app: INestApplication): INestApplication => {
    app.useWebSocketAdapter(
        new SocketStateAdapter(app, app.get(RedisPropagatorService))
    );

    return app;
};
