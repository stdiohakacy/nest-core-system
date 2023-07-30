import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { SMSSendDTO } from '../dtos/sms.send.dto';
import TwilioService from '../../../common/integrations/sms/twilio/services/twilio.service';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { SmsRepository } from '../repositories/sms.repository';
import { SmsEntity } from '../entities/sms.entity';

export class SmsSendCommand implements ICommand {
    constructor(public readonly payload: SMSSendDTO) {}
}

@CommandHandler(SmsSendCommand)
export class SmsSendHandler implements ICommandHandler<SmsSendCommand> {
    constructor(
        private readonly twilioService: TwilioService,
        private readonly smsRepo: SmsRepository
    ) {}

    async execute({ payload }: SmsSendCommand) {
        const { phoneNumber, content } = payload;
        const responses: MessageInstance[] =
            await this.twilioService.sendMessage(phoneNumber, content);

        const smsEntities = responses.map((response) => {
            const smsEntity = new SmsEntity();
            smsEntity.response = response;
            return smsEntity;
        });

        await this.smsRepo.createMany(smsEntities);
    }
}
