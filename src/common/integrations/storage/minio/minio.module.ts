import { Module } from '@nestjs/common';
import { MinioService } from './services/minio.service';

@Module({
    imports: [],
    exports: [MinioService],
    providers: [MinioService],
})
export class MinioModule {}
