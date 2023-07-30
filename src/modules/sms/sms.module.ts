import { Module } from '@nestjs/common';
import { SmsSendHandler } from './commands/sms.send.command';
import { IntegrationModule } from '../../common/integrations/integration.module';
import { SmsRepository } from './repositories/sms.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsEntity } from './entities/sms.entity';

const smsCommandHandlers = [SmsSendHandler];
const repositories = [SmsRepository];

@Module({
    imports: [IntegrationModule, TypeOrmModule.forFeature([SmsEntity])],
    providers: [...smsCommandHandlers, ...repositories],
    exports: [...repositories],
})
export class SMSModule {}
