import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { MessageRepository } from '../repositories/message.repository';
import { RabbitMQService } from '../../../common/message-queue/rmq/services/rabbitmq.service';
import { ENUM_BASE_OPERATION_TYPE } from '../../../common/base/constants/base.enum.operation.constant';
import { ENUM_RMQ_EXCHANGE_TYPE } from '../../../common/message-queue/rmq/constants/rmq.enum.constant';
import { RMQ_SOCKET_SYNC_QUEUE_NAME } from '../../../common/message-queue/rmq/constants/rmq.constant';
import { Socket } from 'socket.io';
import { MessageEntity } from '../entities/message.entity';
import { ENUM_SOCKET_MESSAGE_KEY } from '../../../common/socket/constants/socket.enum.constant';
import { MessageCreateDTO } from '../dtos/message.create.dto';
import { InternalServerErrorException } from '@nestjs/common';

export class MessageCreateCommand implements ICommand {
    constructor(public readonly payload: MessageCreateDTO) {}
}
@CommandHandler(MessageCreateCommand)
export class MessageCreateHandler
    implements ICommandHandler<MessageCreateCommand>
{
    constructor(
        private readonly messageRepo: MessageRepository,
        private readonly rmqService: RabbitMQService
    ) {}

    async execute({ payload }: MessageCreateCommand): Promise<MessageEntity> {
        const exchangeName = `message.${ENUM_BASE_OPERATION_TYPE.INSERT}`;
        const routingKey = `message.${ENUM_BASE_OPERATION_TYPE.INSERT}`;

        const message = {
            entity: 'messages',
            data: payload,
            operation: ENUM_BASE_OPERATION_TYPE.INSERT,
        };

        // Publish message to RabbitMQ
        await this.publishMessageToRabbitMQ(exchangeName, routingKey, message);

        // Create a new MessageEntity instance for saving in the database
        const messageEntity = this.createMessageEntity(payload);

        try {
            // Save the message in the database
            const messageCreated = await this.messageRepo.createGet(
                messageEntity
            );
            return messageCreated;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to create message');
        }
    }

    private async publishMessageToRabbitMQ(
        exchangeName: string,
        routingKey: string,
        message: any
    ): Promise<void> {
        await this.rmqService.publishToExchange(
            exchangeName,
            routingKey,
            JSON.stringify(message)
        );
        await this.rmqService.assertExchange(
            exchangeName,
            ENUM_RMQ_EXCHANGE_TYPE.DIRECT,
            { durable: true }
        );
        await this.rmqService.assertQueue(RMQ_SOCKET_SYNC_QUEUE_NAME, {
            durable: true,
        });
        await this.rmqService.bindQueue(
            RMQ_SOCKET_SYNC_QUEUE_NAME,
            exchangeName,
            routingKey
        );
    }

    private createMessageEntity(payload: MessageCreateDTO): MessageEntity {
        const { id, fromUserId, conversationId, content, createdAt } = payload;

        const message = new MessageEntity();
        message.id = id;
        message.fromUserId = fromUserId;
        message.conversationId = conversationId;
        message.content = content;
        message.createdAt = createdAt;

        return message;
    }
}
