import { Column, Entity } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { SmsDTO } from '../dtos/sms.dto';
import { SmsTwilioResponseType } from '../constants/sms.type.constant';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';

export interface ISmsEntity extends IBaseEntity<SmsDTO> {
    response: SmsTwilioResponseType | any;
}

@Entity({ name: 'sms' })
@UseDTO(SmsDTO)
export class SmsEntity extends BaseEntity<SmsDTO> implements ISmsEntity {
    @Column({ name: 'response', type: 'jsonb' })
    response: SmsTwilioResponseType | any;
}
