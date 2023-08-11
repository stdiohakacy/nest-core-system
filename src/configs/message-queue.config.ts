import { registerAs } from '@nestjs/config';

export default registerAs(
    'message-queue',
    (): Record<string, any> => ({
        rmq: {
            username: process.env.RMQ_USERNAME || 'rabbitmq',
            password: process.env.RMQ_PASSWORD || 'admin',
            host: process.env.RMQ_HOST || 'localhost',
            port: process.env.RMQ_PORT || 5672,
            portUI: Number(process.env.RMQ_PORT_UI) || 15672,
        },
    })
);
