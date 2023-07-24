import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailProcessor } from './processors/mail.processor';
import path from 'path';

@Module({
    imports: [
        BullModule.forRoot({ redis: { host: 'localhost', port: 6379 } }),
        BullModule.registerQueue({ name: 'email' }),
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.GMAIL_HOST,
                    port: Number(process.env.GMAIL_PORT),
                    secure: false,
                    auth: {
                        user: process.env.GMAIL_USERNAME,
                        pass: process.env.GMAIL_PASSWORD,
                    },
                },
                defaults: { from: '"No Reply" <no-reply@example.com>' },
                template: {
                    dir: path.join(__dirname, '/templates'),
                    adapter: new HandlebarsAdapter(),
                    options: { strict: true },
                },
                options: { transport: 'bullmq', queue: 'email' },
            }),
        }),
    ],
    providers: [EmailProcessor],
})
export class MailModule {}
