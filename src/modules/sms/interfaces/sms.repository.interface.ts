import { SmsEntity } from '../entities/sms.entity';

export interface ISmsRepository {
    createMany(sms: SmsEntity[]): Promise<void>;
}
