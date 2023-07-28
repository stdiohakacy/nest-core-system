export interface IMail {
    from: string;
    to: string;
    subject: string;
    text: string;
    [key: string]: any;
}

export interface IMailAccountActivationParams {
    name: string;
    activationLink: string;
}

export interface IMailForgotPasswordParams {
    name: string;
    resetPasswordLink: string;
}
