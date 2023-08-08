export interface IProductRepository {
    createMany(categories: any[]): Promise<void>;
}
