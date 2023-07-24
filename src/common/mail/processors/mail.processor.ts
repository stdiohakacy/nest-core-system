// email.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bull';

@Processor('email')
export class EmailProcessor {
    constructor(private readonly mailerService: MailerService) {}
    @Process('send')
    async sendEmail(
        job: Job<{
            email: string;
            subject: string;
            template: string;
            context: object;
        }>
    ) {
        const { data } = job;
        const { email, subject, template, context } = data;
        await this.mailerService.sendMail({
            to: email,
            subject,
            template: template + '.hbs',
            context,
        });
    }
}
