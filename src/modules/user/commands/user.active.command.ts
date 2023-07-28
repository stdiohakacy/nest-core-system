import { InsertResult, UpdateResult } from 'typeorm';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserLoginDTO } from '../dtos/user.login.dto';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';
import { UserActiveDTO } from '../dtos/user.active.dto';
import { UserRepository } from '../repositories/user.repository';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';

export class UserActiveCommand implements ICommand {
    constructor(public readonly payload: UserActiveDTO) {}
}

@CommandHandler(UserActiveCommand)
export class UserActiveHandler implements ICommandHandler<UserActiveCommand> {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly helperDateService: HelperDateService
    ) {}
    async execute({ payload }: UserActiveCommand) {
        const { activeKey, username } = payload;
        const user = await this.userRepo.findOneByUsername(username);
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }
        if (user.isActive) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_IS_ACTIVE_ERROR,
                message: 'user.error.isActiveInvalid',
            });
        }
        if (user.activeKey !== activeKey) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_ACTIVE_KEY_INVALID_ERROR,
                message: 'user.error.activeKeyInvalid',
            });
        }

        if (user.activeExpire < this.helperDateService.create()) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_ACTIVE_KEY_INVALID_ERROR,
                message: 'user.error.activeKeyInvalid',
            });
        }
        user.active({ activatedAt: this.helperDateService.create() });
        await this.userRepo.update(user);
    }
}
