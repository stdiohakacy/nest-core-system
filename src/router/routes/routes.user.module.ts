import { Module } from '@nestjs/common';
import { ApiKeyModule } from '@common/api-key/api-key.module';
import { LoggerModule } from '@common/logger/logger.module';
import { RoleModule } from '@modules/role/role.module';
import { UserUserController } from '@modules/user/controllers/user.user.controller';
import { UserModule } from '@modules/user/user.module';

@Module({
    controllers: [UserUserController],
    providers: [],
    exports: [UserModule, ApiKeyModule, RoleModule, LoggerModule],
    imports: [UserModule, ApiKeyModule, RoleModule, LoggerModule],
})
export class RoutesUserModule {}
