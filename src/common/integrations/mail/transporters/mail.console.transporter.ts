import { Logger } from '@nestjs/common';
import {
    IMail,
    IMailAccountActivationParams,
} from '../interfaces/mail.interface';
import { IMailTransporter } from './mail.transporter';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
export class MailConsoleTransporter implements IMailTransporter<any> {
    private readonly logger: Logger;

    constructor() {
        this.logger = new Logger(this.constructor.name);
    }

    sendMail(mail: IMail) {
        console.log('mail console sent');
    }

    sendMailAccountActivation(params: IMailAccountActivationParams) {
        const templatePath = '../templates/account-activation.hbs';
        const template = fs.readFileSync(
            path.join(__dirname, templatePath),
            'utf8'
        );
        const compiledTemplate = handlebars.compile(template);
        const html = compiledTemplate(params);
        this.logger.log(html);
    }
}
