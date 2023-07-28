import { IMail, IMailAccountActivationParams } from './mail.interface';

export interface IMailService {
    sendAccountActivation(mail: IMailAccountActivationParams);
}
