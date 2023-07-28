import {
    IMail,
    IMailAccountActivationParams,
    IMailForgotPasswordParams,
} from './mail.interface';

export interface IMailService {
    sendAccountActivation(mail: IMailAccountActivationParams);
    sendForgotPassword(mail: IMailForgotPasswordParams);
}
