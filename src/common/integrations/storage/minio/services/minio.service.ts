import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { ClientOptions } from 'minio';
import { IMinioService } from '../interfaces/minio.service.interface';

@Injectable()
export class MinioService implements IMinioService {
    private minioClient: Minio.Client;

    constructor(private readonly configService: ConfigService) {
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get<string>(
                'integration.storage.minio.endpoint'
            ),
            port: Number(
                this.configService.get<number>('integration.storage.minio.port')
            ),
            useSSL: this.configService.get<boolean>(
                'integration.storage.minio.useSSL'
            ),
            accessKey: this.configService.get<string>(
                'integration.storage.minio.accessKey'
            ),
            secretKey: this.configService.get<string>(
                'integration.storage.minio.secretKey'
            ),
        } as ClientOptions);
    }

    async createBucket(bucketName: string): Promise<void> {
        const exists = await this.minioClient.bucketExists(bucketName);

        if (!exists) {
            await this.minioClient.makeBucket(
                bucketName,
                this.configService.get<string>(
                    'integration.storage.minio.region'
                )
            );
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

    async getBuckets(): Promise<Minio.BucketItemFromList[]> {
        return this.minioClient.listBuckets();
    }

    async removeBucket(bucketName: string): Promise<void> {
        return await this.minioClient.removeBucket(bucketName);
    }
}
