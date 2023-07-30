import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from '../../../common/response/decorators/response.decorator';
import { IResponse } from '../../../common/response/interfaces/response.interface';
import { CommandBus } from '@nestjs/cqrs';
import { SMSPublicSendDoc } from '../docs/sms.public.doc';
import { SMSSendDTO } from '../dtos/sms.send.dto';
import { SmsSendCommand } from '../commands/sms.send.command';

@ApiTags('modules.public.sms')
@Controller({ version: '1', path: '/sms' })
export class SMSPublicController {
    constructor(private readonly commandBus: CommandBus) {}

    @SMSPublicSendDoc()
    @Response('sms.send')
    @HttpCode(HttpStatus.OK)
    @Post('/send')
    async sendSMS(@Body() payload: SMSSendDTO): Promise<IResponse> {
        return await this.commandBus.execute(new SmsSendCommand(payload));
    }
}
