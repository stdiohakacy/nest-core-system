import { Injectable, Inject } from '@nestjs/common';
import { Options } from 'amqp-connection-manager';
import { Connection } from 'amqplib';

@Injectable()
export class RabbitMQService {
    constructor(
        @Inject('RABBITMQ_CONNECTION') private readonly connection: Connection
    ) {}

    async ping(queueName: string) {
        try {
            const channel = await this.connection.createChannel();
            await channel.checkQueue(queueName);
            await channel.close();
            return true;
        } catch (error) {
            return false;
        }
    }

    async publishMessage(
        exchange: string,
        routingKey: string,
        content: any
    ): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.publish(
            exchange,
            routingKey,
            Buffer.from(JSON.stringify(content))
        );
        await channel.close();
    }

    async consumeMessage(
        queue: string,
        callback: (content: Buffer) => void
    ): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queue, { durable: true });
        await channel.consume(queue, (message) => {
            if (message !== null) {
                callback(message.content);
                channel.ack(message);
            }
        });
        await channel.close();
    }
    async assertExchange(
        exchange: string,
        type: string,
        options: Options.AssertExchange
    ) {
        const channel = await this.connection.createChannel();
        await channel.assertExchange(exchange, type, options);
        await channel.close();
    }

    async assertQueue(
        queue: string,
        options?: Options.AssertQueue
    ): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queue, options);
        await channel.close();
    }

    async bindQueue(
        queue: string,
        source: string,
        pattern: string,
        args?: any
    ): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.bindQueue(queue, source, pattern, args);
        await channel.close();
    }

    async publishToExchange(
        exchange: string,
        routingKey: string,
        content: string
    ): Promise<void> {
        const channel = await this.connection.createChannel();
        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.publish(exchange, routingKey, Buffer.from(content));
        await channel.close();
    }
}
