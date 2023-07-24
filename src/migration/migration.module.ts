import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ApiKeyModule } from '@common/api-key/api-key.module';
import { AuthModule } from '@common/auth/auth.module';
import { CommonModule } from '@common/common.module';
import { UserModule } from '@modules/user/user.module';
import { RoleModule } from '@modules/role/role.module';
import { MigrationApiKeySeed } from 'src/migration/seeds/migration.api-key.seed';
import { MigrationSettingSeed } from 'src/migration/seeds/migration.setting.seed';

@Module({
    imports: [
        CommonModule,
        CommandModule,
        ApiKeyModule,
        AuthModule,
        RoleModule,
        UserModule,
    ],
    providers: [MigrationApiKeySeed, MigrationSettingSeed],
    exports: [],
})
export class MigrationModule {}
