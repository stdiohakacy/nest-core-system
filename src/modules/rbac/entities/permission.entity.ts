import { Column, Entity, OneToMany } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { RolePermissionEntity } from './role-permissions.entity';
import { PermissionDTO } from '../../../common/rbac/dtos/permission.dto';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';

export interface IPermissionEntity extends IBaseEntity<PermissionDTO> {
    name: string;
}

@Entity({ name: 'permissions' })
@UseDTO(PermissionDTO)
export class PermissionEntity
    extends BaseEntity<PermissionDTO>
    implements IPermissionEntity
{
    @Column({ name: 'name', unique: true })
    name: string;

    /* Relationships */

    @OneToMany(
        () => RolePermissionEntity,
        (rolePermissions) => rolePermissions.permission
    )
    rolePermissions: RolePermissionEntity[];
}
