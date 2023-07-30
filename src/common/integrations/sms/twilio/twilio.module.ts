import { Module, forwardRef } from '@nestjs/common';
import TwilioService from './services/twilio.service';
import { UserModule } from '../../../../modules/user/user.module';

@Module({
    imports: [],
    exports: [TwilioService],
    providers: [TwilioService],
})
export class TwilioModule {}
