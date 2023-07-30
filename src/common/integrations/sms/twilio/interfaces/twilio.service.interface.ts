import { VerificationInstance } from 'twilio/lib/rest/verify/v2/service/verification';

export interface ITwilioService {
    initPhoneNumberVerification(phone: string): Promise<VerificationInstance>;
    confirmPhoneNumber(
        phoneNumber: string,
        verificationCode: string
    ): Promise<void>;
    sendMessage(receiverPhoneNumber: string | string[], contentMessage: string);
}
