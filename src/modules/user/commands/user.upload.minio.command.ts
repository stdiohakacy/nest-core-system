import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { AccessTokenRepository } from '../../../modules/access-token/repositories/access-token.repository';
import { IFile } from '../../../common/file/interfaces/file.interface';
import { MinioService } from '../../../common/integrations/storage/minio/services/minio.service';

export class UserUploadMinioCommand implements ICommand {
    constructor(public readonly file: IFile) {}
}

@CommandHandler(UserUploadMinioCommand)
export class UserUploadMinioHandler
    implements ICommandHandler<UserUploadMinioCommand>
{
    constructor(private readonly minioService: MinioService) {}
    async execute({ file }: UserUploadMinioCommand) {
        const bucketName = 'my-bucket';
        const objectName = file.originalname;

        await this.minioService.createBucket(bucketName);
        await this.minioService.uploadObject(
            bucketName,
            objectName,
            file.buffer
        );

        return { message: 'File uploaded successfully.' };
    }
}
