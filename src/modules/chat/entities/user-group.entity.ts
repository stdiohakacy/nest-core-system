import { Column, Entity } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { UserGroupDTO } from '../dtos/user-group.dto';

export interface IUserGroupEntity extends IBaseEntity<UserGroupDTO> {
    userId: string;
    groupId: string;
}

@Entity({ name: 'group_users' })
@UseDTO(UserGroupDTO)
export class UserGroupEntity
    extends BaseEntity<UserGroupDTO>
    implements IUserGroupEntity
{
    @Column({ name: 'userId', type: 'uuid' })
    userId: string;

    @Column({ name: 'groupId', type: 'uuid' })
    groupId: string;
}
