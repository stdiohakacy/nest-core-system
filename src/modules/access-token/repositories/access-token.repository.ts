import { UpdateResult, DeleteResult, Repository, InsertResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationListDTO } from '../../../common/pagination/dtos/pagination.list.dto';
import { BaseRepository } from '../../../common/base/repository/base.repository';
import { AccessTokenEntity } from '../entities/access-token.entity';
import { IAccessTokenRepository } from '../interfaces/access-token.repository.interface';
import { ENUM_ACCESS_TOKEN_STATUS } from '../constants/access-token.enum.constant';

@Injectable()
export class AccessTokenRepository
    extends BaseRepository<AccessTokenEntity>
    implements IAccessTokenRepository
{
    constructor(
        @InjectRepository(AccessTokenEntity)
        private readonly accessTokenRepo: Repository<AccessTokenEntity>
    ) {
        super();
    }

    async getByToken(token: string): Promise<AccessTokenEntity> {
        return await this.accessTokenRepo.findOneBy({ token });
    }

    async isTokenRevoke(token: string): Promise<boolean> {
        // const isValid = await this.accessTokenRepo.exist({
        //     where: { token, status: ENUM_ACCESS_TOKEN_STATUS.ACTIVE },
        // });
        // return isValid;
        return true;
    }
    async revokeByToken(token: string): Promise<UpdateResult> {
        return await this.accessTokenRepo.update(
            { token },
            { status: ENUM_ACCESS_TOKEN_STATUS.REVOKE }
        );
    }

    async revokeByUserId(
        userId: string,
        updatedBy?: string
    ): Promise<UpdateResult> {
        return await this.accessTokenRepo.update(
            { userId },
            {
                status: ENUM_ACCESS_TOKEN_STATUS.REVOKE,
                updatedBy,
            }
        );
    }

    async findOneById(id: string) {
        throw new Error('Method not implemented.');
    }

    findAll(find: Record<string, any>, pagination: PaginationListDTO) {
        throw new Error('Method not implemented.');
    }

    async create(accessToken: AccessTokenEntity): Promise<AccessTokenEntity> {
        return await this.accessTokenRepo.save(accessToken);
    }

    update(
        accessToken: Partial<AccessTokenEntity>
    ): Promise<AccessTokenEntity> {
        throw new Error('Method not implemented.');
    }

    delete(id: string): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }

    truncate(): Promise<DeleteResult> {
        throw new Error('Method not implemented.');
    }
}
