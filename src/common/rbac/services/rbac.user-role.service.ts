import { Injectable } from '@nestjs/common';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEntity } from 'src/modules/rbac/entities/user-role.entity';
import { IRBACUserRoleService } from '../interfaces/rbac.user-role.service.interface';
import { UserRoleCreateRawDTO } from '../dtos/user-role.create-raw.dto';
import { UserRoleCreateDTO } from '../dtos/user-role.create.dto';

@Injectable()
export class RBACUserRoleService implements IRBACUserRoleService {
    constructor(
        @InjectRepository(UserRoleEntity)
        private userRoleRepo: Repository<UserRoleEntity>
    ) {}
    async create(data: UserRoleCreateDTO) {
        const userRoleEntity = this.userRoleRepo.create(data);
        return await this.userRoleRepo.save(userRoleEntity);
    }

    async createRaw({
        userId,
        roleId,
    }: UserRoleCreateRawDTO): Promise<UserRoleEntity> {
        return await this.userRoleRepo.save(
            this.userRoleRepo.create({
                userId,
                roleId,
            })
        );
    }

    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return this.userRoleRepo.delete(find);
    }

    async createMany(payload: UserRoleCreateDTO[]) {
        await this.userRoleRepo.save(payload);
    }
}
