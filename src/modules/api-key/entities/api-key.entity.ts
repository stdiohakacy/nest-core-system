import { Column, Entity } from 'typeorm';
import { ApiKeyDTO } from '../../../common/api-key/dtos/api-key.dto';
import { ENUM_API_KEY_TYPE } from '../../../common/api-key/constants/api-key.enum.constant';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';

export interface IApiKeyEntity extends IBaseEntity<ApiKeyDTO> {
    type: ENUM_API_KEY_TYPE;
    name: string;
    key: string;
    hash: string;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
}

@Entity({ name: 'api-keys' })
@UseDTO(ApiKeyDTO)
export class ApiKeyEntity
    extends BaseEntity<ApiKeyDTO>
    implements IApiKeyEntity
{
    @Column({
        name: 'type',
        enum: ENUM_API_KEY_TYPE,
        default: ENUM_API_KEY_TYPE.PUBLIC,
    })
    type: ENUM_API_KEY_TYPE;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'key' })
    key: string;

    @Column({ name: 'hash' })
    hash: string;

    @Column({ name: 'isActive' })
    isActive: boolean;

    @Column({ name: 'startDate', type: 'timestamptz' })
    startDate: Date;

    @Column({ name: 'endDate', type: 'timestamptz' })
    endDate: Date;
}
