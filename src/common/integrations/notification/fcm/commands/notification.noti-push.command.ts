import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import admin from 'firebase-admin';

export class NotificationPushCommand implements ICommand {
    constructor(public readonly token: string) {}
}

@CommandHandler(NotificationPushCommand)
export class NotificationPushHandler
    implements ICommandHandler<NotificationPushCommand>
{
    async execute({ token }: NotificationPushCommand) {
        const message = {
            notification: { title: 'test title', body: 'test body' },
            token,
        };

        try {
            await admin.messaging().send(message);
        } catch (error) {
            console.error('Error sending push notification:', error);
            throw error;
        }
    }
}
