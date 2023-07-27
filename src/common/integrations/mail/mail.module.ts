import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { MailProcessor } from './processors/mail.processor';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        BullModule.registerQueueAsync({
            name: 'mail-queue',
            useFactory: () => ({
                redis: {
                    host: process.env.REDIS_HOST,
                    port: Number(process.env.REDIS_PORT),
                },
            }),
        }),
    ],
    providers: [MailService, MailProcessor],
    exports: [MailService, MailProcessor],
})
export class MailModule {}
