import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { StorageModule } from './storage/storage.module';
import { NotificationModule } from './notification/notification.module';

@Module({
    imports: [MailModule, StorageModule, NotificationModule],
    exports: [MailModule, StorageModule, NotificationModule],
    providers: [],
})
export class IntegrationModule {}
