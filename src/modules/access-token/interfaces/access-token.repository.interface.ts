import { UpdateResult } from 'typeorm';
import { AccessTokenEntity } from '../entities/access-token.entity';

export interface IAccessTokenRepository {
    revokeByUserId(userId: string): Promise<UpdateResult>;
    revokeByToken(token: string): Promise<UpdateResult>;
    isTokenRevoke(token: string): Promise<boolean>;
    getByToken(token: string): Promise<AccessTokenEntity>;
}
