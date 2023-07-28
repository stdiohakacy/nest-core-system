import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { StorageModule } from './storage/storage.module';

@Module({
    imports: [MailModule, StorageModule],
    exports: [MailModule, StorageModule],
    providers: [],
})
export class IntegrationModule {}
