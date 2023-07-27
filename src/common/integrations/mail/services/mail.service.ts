import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { IMail } from '../interfaces/mail.interface';
import {
    ENUM_MAIL_PROCESSOR_NAME,
    ENUM_QUEUE_NAME,
} from '../constants/mail.enum.constant';
import { IMailService } from '../interfaces/mail.service.interface';

@Injectable()
export class MailService implements IMailService {
    constructor(
        @InjectQueue(ENUM_QUEUE_NAME.MAIL) private readonly emailQueue: Queue
    ) {}

    async sendAccountActivation(data: IMail) {
        this.emailQueue.add(ENUM_MAIL_PROCESSOR_NAME.ACCOUNT_ACTIVATION, data);
    }
}
