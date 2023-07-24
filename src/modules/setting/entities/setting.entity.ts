import { BaseEntity, IBaseEntity } from 'src/common/base/entity/base.entity';
import { UseDTO } from 'src/common/decorators/use-dto.decorator';
import { ENUM_SETTING_DATA_TYPE } from 'src/common/setting/constants/setting.enum.constant';
import { SettingDTO } from 'src/common/setting/dtos/setting.dto';
import { Column, Entity } from 'typeorm';

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
