import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserEntity } from './entities/user.entity';
import { IntegrationModule } from 'src/common/integrations/integration.module';
import { UserActiveHandler } from './commands/user.active.command';
import { UserRepository } from './repositories/user.repository';

const commandHandlers = [UserActiveHandler];
const repositories = [UserRepository];

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), IntegrationModule],
    exports: [UserService, IntegrationModule],
    providers: [...commandHandlers, ...repositories, UserService],
    controllers: [],
})
export class UserModule {}
