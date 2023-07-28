import { UserEntity } from '../entities/user.entity';
import { UpdateResult, DeleteResult, Repository, InsertResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { BaseRepository } from '../../../common/base/repository/base.repository';

@Injectable()
export class UserRepository
    extends BaseRepository<UserEntity>
    implements IUserRepository
{
    async findOneByUsername(username: string): Promise<UserEntity> {
        return await this.userRepo.findOneBy({ username });
    }

    async findOneById(id: string) {
        return await this.userRepo.findOneBy({ id });
    }
    async findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        const { _limit, _offset, _order } = pagination;
        return await this.userRepo.find({
            where: find,
            take: _limit,
            skip: _offset,
            order: _order,
        });
    }
    async create(user: UserEntity): Promise<InsertResult> {
        return await this.userRepo.insert(user);
    }
    async update(user: Partial<UserEntity>) {
        return await this.userRepo.save(user);
    }
    async delete(id: string): Promise<DeleteResult> {
        return await this.userRepo.delete(id);
    }
    async truncate(): Promise<DeleteResult> {
        return await this.userRepo.delete({});
    }
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
    ) {
        super();
    }
    async findOneByEmail(email: string): Promise<UserEntity> {
        return await this.userRepo.findOneBy({ email });
    }
}
