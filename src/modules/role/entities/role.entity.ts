import { BaseEntity, IBaseEntity } from 'src/common/base/entity/base.entity';
import { RoleDTO } from '../dtos/role.dto';
import { ENUM_ROLE_TYPE } from '../constants/role.enum.constant';
import { Column, Entity } from 'typeorm';
import { UseDTO } from 'src/common/decorators/use-dto.decorator';

export interface IRoleEntity extends IBaseEntity<RoleDTO> {
    name: string;
    isActive: boolean;
    type: ENUM_ROLE_TYPE;
    description?: string;
}

@Entity({ name: 'roles' })
@UseDTO(RoleDTO)
export class RoleEntity extends BaseEntity<RoleDTO> implements IRoleEntity {
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'isActive' })
    isActive: boolean;

    @Column({
        name: 'type',
        enum: ENUM_ROLE_TYPE,
        default: ENUM_ROLE_TYPE.USER,
    })
    type: ENUM_ROLE_TYPE;

    @Column({ name: 'description', nullable: true })
    description?: string;
}
