import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IRoleService } from '@modules/role/interfaces/role.service.interface';
import { RoleEntity } from '../entities/role.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { RoleCreateDTO } from '../dtos/role.create.dto';
import { RoleUpdateDTO } from '../dtos/role.update.dto';
import { PaginationListDTO } from '@common/pagination/dtos/pagination.list.dto';

@Injectable()
export class RoleService implements IRoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepo: Repository<RoleEntity>
    ) {}

    async findAllAndCount(
        find: Record<string, any>,
        pagination: PaginationListDTO
    ): Promise<[RoleEntity[], number]> {
        const { _limit, _offset, _order } = pagination;
        return await this.roleRepo.findAndCount({
            where: find,
            take: _limit,
            skip: _offset,
            order: _order,
        });
    }

    async findAll(find?: Record<string, any>): Promise<RoleEntity[]> {
        return await this.roleRepo.find(find);
    }

    async findOneById(id: string): Promise<RoleEntity> {
        return await this.roleRepo.findOneBy({ id });
    }

    async findOne(find: Record<string, any>): Promise<RoleEntity> {
        return await this.roleRepo.findOne(find);
    }

    async findOneByName(name: string): Promise<RoleEntity> {
        return await this.roleRepo.findOneBy({ name });
    }

    async getTotal(find?: Record<string, any>): Promise<number> {
        return await this.roleRepo.count(find);
    }

    async existByName(name: string): Promise<boolean> {
        return await this.roleRepo.exist({ where: { name } });
    }

    async create({
        name,
        description,
        type,
    }: RoleCreateDTO): Promise<RoleEntity> {
        const create: RoleEntity = new RoleEntity();
        create.name = name;
        create.description = description;
        create.type = type;
        create.isActive = true;

        return this.roleRepo.save<RoleEntity>(create);
    }

    async update(
        role: RoleEntity,
        { description }: RoleUpdateDTO
    ): Promise<RoleEntity> {
        role.description = description;
        return this.roleRepo.save(role);
    }

    // async updatePermissions(
    //     repository: RoleEntity,
    //     { permissions, type }: RoleUpdatePermissionDto,
    //     options?: IDatabaseSaveOptions
    // ): Promise<RoleEntity> {
    //     repository.permissions = permissions;
    //     repository.type = type;

    //     return this.roleRepository.save(repository, options);
    // }

    async active(role: RoleEntity): Promise<RoleEntity> {
        role.isActive = true;
        return this.roleRepo.save(role);
    }

    async inactive(role: RoleEntity): Promise<RoleEntity> {
        role.isActive = false;
        return this.roleRepo.save(role);
    }

    async delete(role: RoleEntity): Promise<UpdateResult> {
        return this.roleRepo.softDelete(role.id);
    }

    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return this.roleRepo.delete(find);
    }

    async createMany(data: RoleCreateDTO[]): Promise<RoleEntity[]> {
        const create: RoleEntity[] = data.map(({ type, name }) => {
            const entity: RoleEntity = new RoleEntity();
            entity.type = type;
            entity.isActive = true;
            entity.name = name;

            return entity;
        });
        return await this.roleRepo.save<RoleEntity>(create);
    }
}
