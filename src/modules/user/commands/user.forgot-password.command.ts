import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';
import { UserRepository } from '../repositories/user.repository';
import { HelperDateService } from '../../../common/helper/services/helper.date.service';
import { UserForgotPasswordDTO } from '../dtos/user.forgot-password.dto';
import { randomBytes } from 'crypto';
import { MailService } from '../../../common/integrations/mail/services/mail.service';
import { IMailForgotPasswordParams } from '../../../common/integrations/mail/interfaces/mail.interface';
import { ConfigService } from '@nestjs/config';

export class UserForgotPasswordCommand implements ICommand {
    constructor(public readonly payload: UserForgotPasswordDTO) {}
}

@CommandHandler(UserForgotPasswordCommand)
export class UserForgotPasswordHandler
    implements ICommandHandler<UserForgotPasswordCommand>
{
    constructor(
        private readonly userRepo: UserRepository,
        private readonly helperDateService: HelperDateService,
        private readonly mailService: MailService,
        private readonly configService: ConfigService
    ) {}
    async execute({ payload }: UserForgotPasswordCommand) {
        const { email } = payload;
        const user = await this.userRepo.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }
        if (!user.isActive) {
            throw new BadRequestException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
                message: 'user.error.inactive',
            });
        }

        const forgotKey = randomBytes(32).toString('hex');
        user.forgotPassword({
            forgotKey,
            forgotExpire: this.helperDateService.forwardInDays(3),
        });

        const appProtocol = this.configService.get<string>('app.protocol');
        const httpHost = this.configService.get<string>('app.http.host');
        const httpPort = this.configService.get<string>('app.http.port');
        const resetPasswordLink = `${appProtocol}://${httpHost}:${httpPort}/reset-password?username=${user.username}&key=${forgotKey}`;

        const userUpdated = await this.userRepo.update(user);
        this.mailService.sendForgotPassword({
            name: `${user.firstName} ${user.lastName}`,
            resetPasswordLink,
        } as IMailForgotPasswordParams);
        return userUpdated;
    }
}
