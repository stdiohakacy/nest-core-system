import { Module } from '@nestjs/common';
import TwilioService from './services/twilio.service';

@Module({
    imports: [],
    exports: [TwilioService],
    providers: [TwilioService],
})
export class TwilioModule {}
