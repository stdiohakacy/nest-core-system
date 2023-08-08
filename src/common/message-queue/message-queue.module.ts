import { Global, Module } from '@nestjs/common';
import { RabbitMQModule } from './rmq/rabbitmq.module';

@Global()
@Module({
    imports: [RabbitMQModule],
    exports: [RabbitMQModule],
    providers: [],
})
export class MessageQueueModule {}
