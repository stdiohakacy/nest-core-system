export interface IUserConversationRepository {
    createMany(userConversations: any[]): Promise<void>;
}
