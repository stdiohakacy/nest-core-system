import { registerAs } from '@nestjs/config';
import { APP_LANGUAGE } from 'src/app/constants/app.constant';
import { ENUM_MESSAGE_LANGUAGE } from '../common/message/constants/message.enum.constant';

export default registerAs(
    'message-queue',
    (): Record<string, any> => ({
        rmq: {
            username: process.env.RMQ_USERNAME || 'rabbitmq',
            password: process.env.RMQ_PASSWORD || 'admin',
            host: process.env.RMQ_HOST || 'localhost',
            port: process.env.RMQ_PORT || 5672,
        },
    })
);
