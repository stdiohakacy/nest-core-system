import { Column, Entity } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { GroupDTO } from '../dtos/group.dto';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';

export interface IGroupEntity extends IBaseEntity<GroupDTO> {
    name: string;
}

@Entity({ name: 'groups' })
@UseDTO(GroupDTO)
export class GroupEntity extends BaseEntity<GroupDTO> implements IGroupEntity {
    @Column({ name: 'content' })
    name: string;
}
