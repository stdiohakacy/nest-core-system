import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { IMailAccountActivationParams } from '../interfaces/mail.interface';
import { ENUM_MAIL_PROCESSOR_NAME } from '../constants/mail.enum.constant';
import { IMailService } from '../interfaces/mail.service.interface';
import { MAIL_QUEUE_NAME } from '../constants/mail.constant';

@Injectable()
export class MailService implements IMailService {
    constructor(
        @InjectQueue(MAIL_QUEUE_NAME) private readonly emailQueue: Queue
    ) {}

    async sendAccountActivation(data: IMailAccountActivationParams) {
        this.emailQueue.add(ENUM_MAIL_PROCESSOR_NAME.ACCOUNT_ACTIVATION, data);
    }
}
