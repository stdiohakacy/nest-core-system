import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';

@Module({
    imports: [
        BullModule.forRoot({ redis: { host: 'localhost', port: 6379 } }),
        BullModule.registerQueue({ name: 'mail' }),
    ],
    providers: [MailService, MailProcessor],
    exports: [MailService, MailProcessor],
})
export class MailModule {}
