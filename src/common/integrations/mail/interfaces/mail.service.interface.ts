import { IMail } from './mail.interface';

export interface IMailService {
    sendAccountActivation(mail: IMail);
}
