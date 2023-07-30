import { Type } from 'class-transformer';
import { BaseDTO } from '../../../common/base/dto/base.dto';
import { SmsTwilioResponseType } from '../constants/sms.type.constant';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SmsDTO extends BaseDTO {
    @ApiProperty({
        name: 'response',
        description: 'Sms response',
        example: {
            body: 'Sent from your Twilio trial account - Provident sint molestiae ipsum itaque aperiam nam repellat.',
            numSegments: '1',
            direction: 'outbound-api',
            from: '+12184234953',
            to: '+84921262052',
            dateUpdated: '2023-07-30T12:28:33.000Z',
            price: null,
            errorMessage: null,
            uri: '/2010-04-01/Accounts/AC7660e4cad2c4db474f6b0dc11dc117f6/Messages/SM66cc2a45e2b75d44447fc5dfdbf73f95.json',
            accountSid: 'AC7660e4cad2c4db474f6b0dc11dc117f6',
            numMedia: '0',
            status: 'queued',
            messagingServiceSid: null,
            sid: 'SM66cc2a45e2b75d44447fc5dfdbf73f95',
            dateSent: null,
            dateCreated: '2023-07-30T12:28:33.000Z',
            errorCode: null,
            priceUnit: 'USD',
            apiVersion: '2010-04-01',
            subresourceUris: {
                media: '/2010-04-01/Accounts/AC7660e4cad2c4db474f6b0dc11dc117f6/Messages/SM66cc2a45e2b75d44447fc5dfdbf73f95/Media.json',
            },
        },
        required: true,
    })
    @IsNotEmpty()
    @Type(() => SmsTwilioResponseType)
    response: SmsTwilioResponseType | any;
}
