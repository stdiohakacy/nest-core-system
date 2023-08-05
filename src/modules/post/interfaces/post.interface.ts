export interface IPostSearchBody {
    id: string;
    title: string;
    content: string;
}

export interface IPostSearchResult {
    hits: {
        total: number;
        hits: Array<{ _source: IPostSearchBody }>;
    };
}
