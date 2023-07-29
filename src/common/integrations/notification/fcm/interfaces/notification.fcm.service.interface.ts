export interface IFCMService {
    pushNotification(
        token: string | string[],
        notification: Notification
    ): Promise<void>;
}
