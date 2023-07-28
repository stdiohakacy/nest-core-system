import { Injectable } from '@nestjs/common';
import { IRBACRoleService } from '../interfaces/rbac.role.service.interface';
import { RoleEntity } from 'src/modules/rbac/entities/role.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleCreateRawDTO } from '../dtos/role.create-raw.dto';

@Injectable()
export class RBACRoleService implements IRBACRoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepo: Repository<RoleEntity>
    ) {}

    async createRaw({ name }: RoleCreateRawDTO): Promise<RoleEntity> {
        return await this.roleRepo.save(this.roleRepo.create({ name }));
    }

    async findOneByName(name: string): Promise<RoleEntity> {
        return await this.roleRepo.findOneBy({ name });
    }

    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return await this.roleRepo.delete(find);
    }

    async findOneById(id: string): Promise<RoleEntity> {
        return await this.roleRepo.findOneBy({ id });
    }
}
