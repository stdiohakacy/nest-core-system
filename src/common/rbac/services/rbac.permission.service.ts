import { Injectable } from '@nestjs/common';
import { DeleteResult, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionCreateRawDTO } from '../dtos/permission.create-raw.dto';
import { IRBACPermissionService } from '../interfaces/rbac.permission.service.interface';
import { PermissionEntity } from '../../../modules/rbac/entities/permission.entity';

@Injectable()
export class RBACPermissionService implements IRBACPermissionService {
    constructor(
        @InjectRepository(PermissionEntity)
        private permissionRepo: Repository<PermissionEntity>
    ) {}

    async createRaw({
        name,
    }: PermissionCreateRawDTO): Promise<PermissionEntity> {
        return await this.permissionRepo.save(
            this.permissionRepo.create({ name })
        );
    }

    async findOneByName(name: string): Promise<PermissionEntity> {
        return await this.permissionRepo.findOneBy({ name });
    }

    async findByNames(name: string[]): Promise<PermissionEntity[]> {
        return this.permissionRepo.find({ where: { name: In(name) } });
    }

    async deleteMany(find: Record<string, any>): Promise<DeleteResult> {
        return await this.permissionRepo.delete(find);
    }
}
