import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { StorageModule } from './storage/storage.module';
import { NotificationModule } from './notification/notification.module';
import { SMSCommonModule } from './sms/sms.module';

@Module({
    imports: [MailModule, StorageModule, NotificationModule, SMSCommonModule],
    exports: [MailModule, StorageModule, NotificationModule, SMSCommonModule],
    providers: [],
})
export class IntegrationModule {}
