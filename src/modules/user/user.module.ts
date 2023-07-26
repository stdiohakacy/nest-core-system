import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserEntity } from './entities/user.entity';
import { IntegrationModule } from 'src/common/integrations/integration.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), IntegrationModule],
    exports: [UserService, IntegrationModule],
    providers: [UserService],
    controllers: [],
})
export class UserModule {}
