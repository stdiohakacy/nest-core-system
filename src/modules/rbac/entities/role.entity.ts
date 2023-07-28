import { Column, Entity, OneToMany } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';

import { UserRoleEntity } from './user-role.entity';
import { RolePermissionEntity } from './role-permissions.entity';
import { RoleDTO } from '../../../common/rbac/dtos/role.dto';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';

export interface IRoleEntity extends IBaseEntity<RoleDTO> {
    name: string;
}

@Entity({ name: 'roles' })
@UseDTO(RoleDTO)
export class RoleEntity extends BaseEntity<RoleDTO> implements IRoleEntity {
    @Column({ name: 'name', unique: true })
    name: string;

    /* Relationships */

    @OneToMany(() => UserRoleEntity, (userRoles) => userRoles.role)
    userRoles?: UserRoleEntity[];

    @OneToMany(
        () => RolePermissionEntity,
        (rolePermissions) => rolePermissions.role
    )
    rolePermissions?: RolePermissionEntity[];
}
