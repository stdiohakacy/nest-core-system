import { Module } from '@nestjs/common';
import { UserUserController } from '../../modules/user/controllers/user.user.controller';
import { UserModule } from '../../modules/user/user.module';
import { ApiKeyModule } from '../../common/api-key/api-key.module';
import { LoggerModule } from '../../common/logger/logger.module';
@Module({
    controllers: [UserUserController],
    providers: [],
    exports: [UserModule, ApiKeyModule, LoggerModule],
    imports: [UserModule, ApiKeyModule, LoggerModule],
})
export class RoutesUserModule {}
