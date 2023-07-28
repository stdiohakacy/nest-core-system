import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { IFile } from '../../../common/file/interfaces/file.interface';
import { MinioService } from '../../../common/integrations/storage/minio/services/minio.service';
import { ConfigService } from '@nestjs/config';

export class UserUploadMinioCommand implements ICommand {
    constructor(public readonly file: IFile) {}
}

@CommandHandler(UserUploadMinioCommand)
export class UserUploadMinioHandler
    implements ICommandHandler<UserUploadMinioCommand>
{
    constructor(
        private readonly minioService: MinioService,
        private readonly configService: ConfigService
    ) {}
    async execute({ file }: UserUploadMinioCommand) {
        const bucketName = this.configService.get<string>(
            'integration.storage.minio.bucketName'
        );
        const objectName = file.originalname;

        await this.minioService.createBucket(bucketName);
        await this.minioService.uploadObject(
            bucketName,
            objectName,
            file.buffer
        );
    }
}
