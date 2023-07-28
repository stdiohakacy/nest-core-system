import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { AccessTokenRepository } from '../../../modules/access-token/repositories/access-token.repository';

export class UserRevokeTokenCommand implements ICommand {
    constructor(
        public readonly id: string,
        public readonly userAuth: UserEntity
    ) {}
}

@CommandHandler(UserRevokeTokenCommand)
export class UserRevokeHandler
    implements ICommandHandler<UserRevokeTokenCommand>
{
    constructor(private readonly accessTokenRepo: AccessTokenRepository) {}
    async execute({ id, userAuth }: UserRevokeTokenCommand) {
        await this.accessTokenRepo.revokeByUserId(id, userAuth.id);
    }
}
