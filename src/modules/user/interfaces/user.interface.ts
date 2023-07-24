import { UserEntity } from '../entities/user.entity';

export interface IUserEntity extends Omit<UserEntity, 'role'> {
    // role: RoleEntity;
}
export interface IUserGoogleEntity {
    accessToken: string;
    refreshToken: string;
}
