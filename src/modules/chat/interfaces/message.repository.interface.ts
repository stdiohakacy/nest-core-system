export interface IMessageRepository {
    createMany(messages: any[]): Promise<void>;
}
