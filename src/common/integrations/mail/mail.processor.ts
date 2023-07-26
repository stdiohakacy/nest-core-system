import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { IMail } from './mail.interface';
import { SentMessageInfo } from 'nodemailer';
import nodemailer from 'nodemailer';
import SibTransport from 'nodemailer-sendinblue-transport';

@Processor('mail')
export class MailProcessor {
    private readonly transporter: nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport(
            new SibTransport({ apiKey: process.env.SIB_API_KEY })
        );
    }

    @Process('welcome')
    async sendWelcomeEmail(job: Job<IMail>) {
        const { data } = job;
        console.log(data);
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
        const info: SentMessageInfo = await this.transporter.sendMail({
            from: 'Your Name <your-email@example.com>',
            to: 'nguyendangduy2210@gmail.com',
            subject: 'Test Subject',
            text: 'test text',
        });
        console.log(info);
    }

    @Process('reset-password')
    async sendResetPasswordEmail(job: Job<IMail>) {
        const { data } = job;
    }
}
