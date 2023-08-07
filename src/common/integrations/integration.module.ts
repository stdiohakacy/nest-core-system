import { Global, Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { StorageModule } from './storage/storage.module';
import { NotificationModule } from './notification/notification.module';
import { SMSCommonModule } from './sms/sms.module';
import { SearchCoreModule } from './search/search.core.module';

@Global()
@Module({
    imports: [
        MailModule,
        StorageModule,
        NotificationModule,
        SMSCommonModule,
        SearchCoreModule,
    ],
    exports: [
        MailModule,
        StorageModule,
        NotificationModule,
        SMSCommonModule,
        SearchCoreModule,
    ],
    providers: [],
})
export class IntegrationModule {}
