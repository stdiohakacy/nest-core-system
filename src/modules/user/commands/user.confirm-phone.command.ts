import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { UserPhoneConfirmDTO } from '../dtos/user.phone-confirmation.dto';
import TwilioService from '../../../common/integrations/sms/twilio/services/twilio.service';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';

export class UserPhoneConfirmCommand implements ICommand {
    constructor(public readonly payload: UserPhoneConfirmDTO) {}
}

@CommandHandler(UserPhoneConfirmCommand)
export class UserPhoneConfirmHandler
    implements ICommandHandler<UserPhoneConfirmCommand>
{
    constructor(
        private readonly twilioService: TwilioService,
        private readonly userRepo: UserRepository
    ) {}

    async execute({ payload }: UserPhoneConfirmCommand) {
        const { verificationCode, mobileNumber, id } = payload;
        const user = await this.userRepo.findOneById(id);
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }
        await this.twilioService.confirmPhoneNumber(
            mobileNumber,
            verificationCode
        );

        user.confirmedPhone();
        await this.userRepo.update(user.id, user);
    }
}
