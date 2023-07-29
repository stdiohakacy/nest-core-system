import {
    Message,
    Notification,
} from 'firebase-admin/lib/messaging/messaging-api';
import { IFCMService } from '../interfaces/notification.fcm.service.interface';
import { Injectable } from '@nestjs/common';
import { isArray } from 'lodash';
import admin from 'firebase-admin';

@Injectable()
export class FCMService implements IFCMService {
    async pushNotification(
        token: string | string[],
        notification: Notification
    ) {
        const messages: Message[] = isArray(token)
            ? token.map((t) => ({ notification, token: t }))
            : [{ token, notification }];

        for (const message of messages) {
            await admin.messaging().send(message);
        }
    }
}
