import { IMail } from '../interfaces/mail.interface';
import { IMailTransporter } from './mail.transporter';

export class MailConsoleTransporter implements IMailTransporter<any> {
    constructor() {}

    sendMail(mail: IMail) {
        console.log('mail console sent');
    }
}
