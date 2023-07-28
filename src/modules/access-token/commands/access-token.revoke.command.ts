import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { AccessTokenRepository } from '../repositories/access-token.repository';

export class AccessTokenRevokeCommand implements ICommand {
    constructor(
        public readonly id: string,
        public readonly userAuth: UserEntity
    ) {}
}

@CommandHandler(AccessTokenRevokeCommand)
export class AccessTokenRevokeHandler
    implements ICommandHandler<AccessTokenRevokeCommand>
{
    constructor(private readonly accessTokenRepo: AccessTokenRepository) {}
    async execute({ id, userAuth }: AccessTokenRevokeCommand) {
        await this.accessTokenRepo.revokeByUserId(id, userAuth.id);
    }
}
