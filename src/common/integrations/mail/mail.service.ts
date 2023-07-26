import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { IMail } from './mail.interface';

@Injectable()
export class MailService {
    constructor(@InjectQueue('mail') private readonly emailQueue: Queue) {}

    async sendWelcomeEmail(data: IMail) {
        const job = await this.emailQueue.add('welcome', data);
        return { jobId: job.id };
    }

    async sendResetPasswordEmail(data: IMail) {
        const job = await this.emailQueue.add('reset-password', data);
        return { jobId: job.id };
    }
}
