import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import nodemailer from 'nodemailer';
import SibTransport from 'nodemailer-sendinblue-transport';
import { ConfigService } from '@nestjs/config';
import { Logger, NotFoundException } from '@nestjs/common';
import {
    ENUM_MAIL_PROCESSOR_NAME,
    ENUM_MAIL_PROVIDER_TYPE,
} from 'src/common/integrations/mail/constants/mail.enum.constant';
import { IMailProcessor } from '../interfaces/mail.processor.interface';
import { ENUM_MAIL_STATUS_CODE_ERROR } from '../constants/mail.status-code.constant';
import { MAIL_QUEUE_NAME } from '../constants/mail.constant';
import { MailSibTransporter } from '../transporters/mail.sib.transporter';
import { MailConsoleTransporter } from '../transporters/mail.console.transporter';

@Processor(MAIL_QUEUE_NAME)
export class MailProcessor implements IMailProcessor {
    private mailTransporter;
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly configService: ConfigService) {
        const providerType = this.configService.get<string>(
            'integration.mail.providerType'
        );

        switch (providerType) {
            case ENUM_MAIL_PROVIDER_TYPE.SIB:
                this.mailTransporter = new MailSibTransporter(
                    nodemailer.createTransport(
                        new SibTransport({
                            apiKey: this.configService.get<string>(
                                'integration.mail.sib.apiKey'
                            ),
                        })
                    )
                );
                break;
            case ENUM_MAIL_PROVIDER_TYPE.CONSOLE:
                this.mailTransporter = new MailConsoleTransporter();
                break;
            default:
                throw new NotFoundException({
                    statusCode:
                        ENUM_MAIL_STATUS_CODE_ERROR.MAIL_PROVIDER_TYPE_NOT_FOUND_ERROR,
                    message: 'mail.error.providerNotFound',
                });
        }
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
        const { from, to, subject, text } = data;
        this.logger.log(
            'Processor:@Process - Sending account activation email.'
        );

        try {
            this.mailTransporter.sendMailAccountActivation({
                activationLink:
                    'https://www.w3schools.com/html/tryit.asp?filename=tryhtml_default_default',
            });
            // this.mailTransporter.sendMail({
            //     from,
            //     to,
            //     subject,
            //     text,
            // });
        } catch (error) {
            this.logger.error(
                'Failed to send account activation email.',
                error.stack
            );
            throw error;
        }
    }
}
