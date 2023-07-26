import { SettingDTO } from '../../../common/setting/dtos/setting.dto';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { ENUM_SETTING_DATA_TYPE } from '../../../common/setting/constants/setting.enum.constant';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';

export interface ISettingEntity extends IBaseEntity<SettingDTO> {
    name: string;
    description?: string;
    type: ENUM_SETTING_DATA_TYPE;
    value: string;
}

@Entity({ name: 'settings' })
@UseDTO(SettingDTO)
export class SettingEntity
    extends BaseEntity<SettingDTO>
    implements ISettingEntity
{
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'type', enum: ENUM_SETTING_DATA_TYPE })
    type: ENUM_SETTING_DATA_TYPE;

    @Column({ name: 'value' })
    value: string;

    @Column({ name: 'description', nullable: true })
    description?: string;
}
