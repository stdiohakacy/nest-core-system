import { BucketItemFromList } from 'minio';

export interface IMinioService {
    getObject(bucketName: string, objectName: string): Promise<Buffer>;
    getBuckets(): Promise<BucketItemFromList[]>;
    createBucket(bucketName: string): Promise<void>;
    removeBucket(bucketName: string): Promise<void>;
    uploadObject(
        bucketName: string,
        objectName: string,
        buffer: Buffer
    ): Promise<void>;
}
