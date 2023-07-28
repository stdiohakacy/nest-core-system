import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { AccessTokenDTO } from '../dtos/access-token.dto';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { ENUM_ACCESS_TOKEN_STATUS } from '../constants/access-token.enum.constant';
import { UserEntity } from '../../../modules/user/entities/user.entity';

export interface IAccessTokenEntity extends IBaseEntity<AccessTokenDTO> {
    token: string;
    userId: string;
    status: ENUM_ACCESS_TOKEN_STATUS;
}

@Entity({ name: 'access_tokens' })
@UseDTO(AccessTokenDTO)
export class AccessTokenEntity
    extends BaseEntity<AccessTokenDTO>
    implements IAccessTokenEntity
{
    @Column({ name: 'token' })
    token: string;

    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @Column({
        name: 'status',
        enum: ENUM_ACCESS_TOKEN_STATUS,
        default: ENUM_ACCESS_TOKEN_STATUS.ACTIVE,
    })
    status: ENUM_ACCESS_TOKEN_STATUS;

    @ManyToOne(() => UserEntity, (user) => user.accessTokens)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}
