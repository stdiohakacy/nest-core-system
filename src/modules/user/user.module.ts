import { AuthModule } from './../../common/auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserEntity } from './entities/user.entity';
import { IntegrationModule } from 'src/common/integrations/integration.module';
import { UserActiveHandler } from './commands/user.active.command';
import { UserRepository } from './repositories/user.repository';
import { UserForgotPasswordHandler } from './commands/user.forgot-password.command';
import { UserResetPasswordHandler } from './commands/user.reset-password.command';

const commandHandlers = [
    UserActiveHandler,
    UserForgotPasswordHandler,
    UserResetPasswordHandler,
];
const repositories = [UserRepository];

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        IntegrationModule,
        AuthModule,
    ],
    exports: [UserService, IntegrationModule],
    providers: [...commandHandlers, ...repositories, UserService],
    controllers: [],
})
export class UserModule {}
