import { Module } from '@nestjs/common';
import { RabbitMQService } from './services/rabbitmq.service';
import { connect } from 'amqplib';

@Module({
    imports: [],
    providers: [
        {
            provide: 'RABBITMQ_CONNECTION',
            useFactory: async () => {
                // const amqp = require('amqplib');
                const connection = await connect({
                    hostname: process.env.RMQ_HOST || 'localhost',
                    port: Number(process.env.RMQ_PORT) || 5672,
                    username: process.env.RMQ_USERNAME || 'rabbitmq',
                    password: process.env.RMQ_PASSWORD || 'admin',
                    vhost: '/',
                });
                return connection;
            },
        },
        RabbitMQService,
    ],
    exports: ['RABBITMQ_CONNECTION', RabbitMQService],
})
export class RabbitMQModule {}
