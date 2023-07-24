import { DeleteResult, UpdateResult } from 'typeorm';
import { RoleCreateDTO } from '../dtos/role.create.dto';
import { RoleUpdatePermissionDTO } from '../dtos/role.update-permission.dto';
import { RoleUpdateDTO } from '../dtos/role.update.dto';
import { RoleEntity } from '../entities/role.entity';
import { PaginationListDTO } from 'src/common/pagination/dtos/pagination.list.dto';

export interface IRoleService {
    findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ): Promise<[RoleEntity[], number]>;
    findAll(find?: Record<string, any>): Promise<RoleEntity[]>;
    findOneById(id: string): Promise<RoleEntity>;
    findOne(find: Record<string, any>): Promise<RoleEntity>;
    findOneByName(name: string): Promise<RoleEntity>;
    getTotal(find?: Record<string, any>): Promise<number>;
    existByName(name: string): Promise<boolean>;
    create(data: RoleCreateDTO): Promise<RoleEntity>;
    update(repository: RoleEntity, data: RoleUpdateDTO): Promise<RoleEntity>;
    // updatePermissions(
    //     repository: RoleEntity,
    //     data: RoleUpdatePermissionDTO
    // ): Promise<RoleEntity>;
    active(repository: RoleEntity): Promise<RoleEntity>;
    inactive(repository: RoleEntity): Promise<RoleEntity>;
    delete(repository: RoleEntity): Promise<UpdateResult>;
    deleteMany(find: Record<string, any>): Promise<DeleteResult>;
    createMany(data: RoleCreateDTO[]): Promise<RoleEntity[]>;
}
