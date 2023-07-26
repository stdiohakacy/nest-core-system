import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailProcessor } from './mail.processor';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT),
            },
        }),
        BullModule.registerQueue({ name: 'mail' }),
    ],
    providers: [MailService, MailProcessor],
    exports: [MailService, MailProcessor],
})
export class MailModule {}
