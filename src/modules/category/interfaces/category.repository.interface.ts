export interface ICategoryRepository {
    createMany(categories: any[]): Promise<void>;
}
