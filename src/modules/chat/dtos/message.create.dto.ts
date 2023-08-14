import { PickType } from '@nestjs/swagger';
import { MessageDTO } from './message.dto';

export class MessageCreateDTO extends PickType(MessageDTO, [
    'id',
    'conversationId',
    'fromUserId',
    'content',
    'createdAt',
]) {}
