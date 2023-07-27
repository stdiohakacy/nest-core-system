import { IMail } from '../interfaces/mail.interface';
import { IMailTransporter } from './mail.transporter';
import nodemailer from 'nodemailer';

export class MailSibTransporter
    implements IMailTransporter<nodemailer.Transporter>
{
    transporter: nodemailer.Transporter;

    constructor(transporter: nodemailer.Transporter) {
        this.transporter = transporter;
    }

    sendMail(mail: IMail) {
        this.transporter.sendMail(mail);
    }
}
