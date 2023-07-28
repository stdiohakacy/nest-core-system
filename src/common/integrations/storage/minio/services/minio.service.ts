// minio.service.ts
import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { ClientOptions } from 'minio';

@Injectable()
export class MinioService {
    private minioClient: Minio.Client;

    constructor() {
        this.minioClient = new Minio.Client({
            endPoint: '127.0.0.1',
            port: 9000,
            useSSL: false,
            accessKey: '7ahreroK5Rn6F6Wr3bLQ',
            secretKey: 'SBKxpI7ldr9G5diCW7rkWK0KffJC70apLPCSJMG3',
        } as ClientOptions);
    }

    async createBucket(bucketName: string): Promise<void> {
        const exists = await this.minioClient.bucketExists(bucketName);

        if (!exists) {
            await this.minioClient.makeBucket(bucketName, 'us-east-1');
        }
    }

    async uploadObject(
        bucketName: string,
        objectName: string,
        buffer: Buffer
    ): Promise<void> {
        await this.minioClient.putObject(bucketName, objectName, buffer);
    }

    async getObject(bucketName: string, objectName: string): Promise<Buffer> {
        const stream = await this.minioClient.getObject(bucketName, objectName);
        const data: Buffer[] = [];

        return new Promise<Buffer>((resolve, reject) => {
            stream.on('data', (chunk) => {
                data.push(chunk);
            });

            stream.on('end', () => {
                const buffer = Buffer.concat(data);
                resolve(buffer);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
}
