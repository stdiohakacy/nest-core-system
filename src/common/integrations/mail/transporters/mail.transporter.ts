import { Logger } from '@nestjs/common';
import { IMail } from '../interfaces/mail.interface';

export interface IMailTransporter<T> {
    transporter?: T;
    sendMail(mail: IMail);
}
