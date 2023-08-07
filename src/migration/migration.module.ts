import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { ApiKeyModule } from '../common/api-key/api-key.module';
import { AuthModule } from '../common/auth/auth.module';
import { CommonModule } from '../common/common.module';
import { MigrationApiKeySeed } from '../migration/seeds/migration.api-key.seed';
import { MigrationSettingSeed } from '../migration/seeds/migration.setting.seed';
import { UserModule } from '../modules/user/user.module';
import { MigrationCategorySeed } from './seeds/migration.category.seed';
import { CategoryModule } from '../modules/category/category.module';

@Module({
    imports: [
        CommonModule,
        CommandModule,
        ApiKeyModule,
        AuthModule,
        UserModule,
        CategoryModule,
    ],
    providers: [
        MigrationApiKeySeed,
        MigrationSettingSeed,
        MigrationCategorySeed,
    ],
    exports: [],
})
export class MigrationModule {}
