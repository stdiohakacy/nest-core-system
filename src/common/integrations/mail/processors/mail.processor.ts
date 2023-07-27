import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { IMail } from '../interfaces/mail.interface';
import { SentMessageInfo } from 'nodemailer';
import nodemailer from 'nodemailer';
import SibTransport from 'nodemailer-sendinblue-transport';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import {
    ENUM_MAIL_PROCESSOR_NAME,
    ENUM_QUEUE_NAME,
} from '../constants/mail.enum.constant';
import { IMailProcessor } from '../interfaces/mail.processor.interface';

@Processor(ENUM_QUEUE_NAME.MAIL)
export class MailProcessor implements IMailProcessor {
    private readonly transporter: nodemailer.Transporter;
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport(
            new SibTransport({
                apiKey: this.configService.get<string>(
                    'integration.mail.sib.apiKey'
                ),
            })
        );
    }

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.log(
            `Processor:@OnQueueActive - Processing job ${job.id} of type ${
                job.name
            }. Data: ${JSON.stringify(job.data)}`
        );
    }

    @OnQueueCompleted()
    onComplete(job: Job) {
        this.logger.log(
            `Processor:@OnQueueCompleted - Completed job ${job.id} of type ${job.name}.`
        );
    }

    @OnQueueFailed()
    onError(job: Job<any>, error) {
        this.logger.log(
            `Processor:@OnQueueFailed - Failed job ${job.id} of type ${job.name}: ${error.message}`,
            error.stack
        );
    }

    @Process(ENUM_MAIL_PROCESSOR_NAME.ACCOUNT_ACTIVATION)
    async sendAccountActivation(job: Job): Promise<any> {
        const { data } = job;
        this.logger.log(
            'Processor:@Process - Sending account activation email.'
        );

        try {
            const info: SentMessageInfo = await this.transporter.sendMail({
                from: 'Your Name <your-email@example.com>',
                to: 'nguyendangduy2210@gmail.com',
                subject: 'Account activation',
                text: 'This is content of account activation',
            });
        } catch (error) {
            this.logger.error(
                'Failed to send account activation email.',
                error.stack
            );
            throw error;
        }
    }
}
