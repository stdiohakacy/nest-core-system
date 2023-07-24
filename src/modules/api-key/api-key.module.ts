import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyXApiKeyStrategy } from '../../common/api-key/guards/x-api-key/api-key.x-api-key.strategy';
import { ApiKeyService } from '../../common/api-key/services/api-key.service';
import { ApiKeyEntity } from '../../modules/api-key/entities/api-key.entity';

@Module({
    providers: [ApiKeyService, ApiKeyXApiKeyStrategy],
    exports: [ApiKeyService],
    controllers: [],
    imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
})
export class ApiKeyModule {}
