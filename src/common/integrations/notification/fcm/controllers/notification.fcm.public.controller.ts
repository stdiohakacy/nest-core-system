import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IResponse } from '../../../../response/interfaces/response.interface';
import { DeviceRegisterDTO } from '../dtos/notification.fcm.device-register.dto';
import { CommandBus } from '@nestjs/cqrs';
import { DeviceRegisterCommand } from '../commands/notification.device-register.command';
import { GetUser } from 'src/modules/user/decorators/user.decorator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { IResult } from 'ua-parser-js';
import {
    RequestUserAgent,
    RequestValidateUserAgent,
} from '../../../../../common/request/decorators/request.decorator';
import { NotificationFCMPublicRegisterDeviceDoc } from '../docs/notification.fcm.public.doc';
import { Response } from 'src/common/response/decorators/response.decorator';
import { NotificationPushCommand } from '../commands/notification.noti-push.command';
import { DeviceTokenDTO } from '../dtos/notification.fcm.device-token.dto';

@ApiTags('modules.public.notification')
@Controller({ version: '1', path: '/notification' })
export class NotificationPublicController {
    constructor(private readonly commandBus: CommandBus) {}

    @NotificationFCMPublicRegisterDeviceDoc()
    @Response('notification.fcm.registerDeviceSucceed')
    @RequestValidateUserAgent()
    @HttpCode(HttpStatus.CREATED)
    @Post('/device')
    async registerDevice(
        @RequestUserAgent() userAgent: IResult,
        @GetUser() userAuth: UserEntity,
        @Body() payload: DeviceRegisterDTO
    ): Promise<IResponse> {
        return await this.commandBus.execute(
            new DeviceRegisterCommand(payload, userAuth, userAgent)
        );
    }

    @Post('/push')
    async pushNotification(@Body() { token }: DeviceTokenDTO) {
        return await this.commandBus.execute(
            new NotificationPushCommand(token)
        );
    }
}
