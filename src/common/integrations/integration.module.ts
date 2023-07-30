import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { StorageModule } from './storage/storage.module';
import { NotificationModule } from './notification/notification.module';
import { SMSModule } from './sms/sms.module';

@Module({
    imports: [MailModule, StorageModule, NotificationModule, SMSModule],
    exports: [MailModule, StorageModule, NotificationModule, SMSModule],
    providers: [],
})
export class IntegrationModule {}
