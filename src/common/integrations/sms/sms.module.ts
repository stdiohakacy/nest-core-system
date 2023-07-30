import { Module } from '@nestjs/common';
import { TwilioModule } from './twilio/twilio.module';

@Module({
    imports: [TwilioModule],
    providers: [],
    exports: [TwilioModule],
})
export class SMSModule {}
