import { Column, Entity, OneToMany } from 'typeorm';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UserDTO } from '../dtos/user.dto';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { AwsS3Serialization } from '../../../common/aws/serializations/aws.s3.serialization';
import { IUserGoogleEntity } from '../interfaces/user.interface';
import { UserRoleEntity } from '../../../modules/rbac/entities/user-role.entity';
import { AccessTokenEntity } from '../../../modules/access-token/entities/access-token.entity';
import { DeviceEntity } from '../../../modules/notification/entities/device.entity';
import { NotificationEntity } from '../../../modules/notification/entities/notification.entity';
import { VirtualColumn } from '../../../common/decorators/virtual-column.decorator';
import { MessageEntity } from '../../../modules/chat/entities/message.entity';
import { ConversationEntity } from '../../../modules/chat/entities/conversation.entity';

export interface IUserEntity extends IBaseEntity<UserDTO> {
    username?: string;
    firstName: string;
    lastName: string;
    mobileNumber?: string;
    email: string;
    password: string;
    passwordExpired: Date;
    passwordCreated: Date;
    passwordAttempt: number;
    signUpDate: Date;
    signUpFrom: ENUM_USER_SIGN_UP_FROM;
    salt: string;
    isActive: boolean;
    inactivePermanent: boolean;
    inactiveDate?: Date;
    blocked: boolean;
    blockedDate?: Date;
    photo?: AwsS3Serialization;
    google?: IUserGoogleEntity;
    activeKey?: string;
    activeExpire?: Date;
    activatedAt?: Date;
    forgotKey?: string;
    forgotExpire?: Date;
    isPhoneConfirmation: boolean;
    // role: string;
}

@Entity({ name: 'users' })
@UseDTO(UserDTO)
export class UserEntity extends BaseEntity<UserDTO> implements IUserEntity {
    @Column({ name: 'username', nullable: true })
    username?: string;

    @Column({ name: 'firstName' })
    firstName: string;

    @Column({ name: 'lastName' })
    lastName: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'password' })
    password: string;

    @Column({ name: 'passwordExpired', type: 'timestamptz' })
    passwordExpired: Date;

    @Column({ name: 'passwordCreated', type: 'timestamptz' })
    passwordCreated: Date;

    @Column({ name: 'passwordAttempt' })
    passwordAttempt: number;

    @Column({ name: 'signUpDate', type: 'timestamptz' })
    signUpDate: Date;

    @Column({
        name: 'signUpFrom',
        enum: ENUM_USER_SIGN_UP_FROM,
        default: ENUM_USER_SIGN_UP_FROM.LOCAL,
    })
    signUpFrom: ENUM_USER_SIGN_UP_FROM;

    @Column({ name: 'salt' })
    salt: string;

    @Column({ name: 'isActive', default: true })
    isActive: boolean;

    @Column({ name: 'inactivePermanent' })
    inactivePermanent: boolean;

    @Column({ name: 'blocked' })
    blocked: boolean;

    @Column({ name: 'inactiveDate', type: 'timestamptz', nullable: true })
    inactiveDate?: Date;

    @Column({ name: 'blockedDate', type: 'timestamptz', nullable: true })
    blockedDate?: Date;

    @Column({ name: 'photo', nullable: true, type: 'jsonb' })
    photo?: AwsS3Serialization;

    @Column({ name: 'google', nullable: true, type: 'jsonb' })
    google?: IUserGoogleEntity;

    @Column({ name: 'mobileNumber', nullable: true })
    mobileNumber?: string;

    @Column('varchar', {
        name: 'activeKey',
        nullable: true,
    })
    activeKey?: string;

    @Column('timestamptz', {
        name: 'activeExpire',
        nullable: true,
    })
    activeExpire?: Date;

    @Column('timestamptz', {
        name: 'activatedAt',
        nullable: true,
    })
    activatedAt?: Date;

    @Column({ name: 'forgotKey', nullable: true })
    forgotKey?: string;

    @Column({ name: 'forgotExpire', nullable: true, type: 'timestamptz' })
    forgotExpire?: Date;

    @Column({ name: 'isPhoneConfirmation', nullable: true, default: false })
    isPhoneConfirmation: boolean;

    @VirtualColumn()
    fullName?: string;

    /* Relationships */

    @OneToMany(() => UserRoleEntity, (userRoles) => userRoles.user)
    userRoles: UserRoleEntity[];

    @OneToMany(() => AccessTokenEntity, (accessTokens) => accessTokens.user)
    accessTokens: AccessTokenEntity[];

    @OneToMany(() => DeviceEntity, (devices) => devices.user)
    devices: DeviceEntity[];

    @OneToMany(() => NotificationEntity, (notifications) => notifications.user)
    notifications: NotificationEntity[];

    @OneToMany(() => MessageEntity, (messages) => messages.fromUser)
    messages: MessageEntity[];

    @OneToMany(() => ConversationEntity, (conversations) => conversations.user)
    conversations: ConversationEntity[];

    active(data: any) {
        this.isActive = true;
        this.activatedAt = data.activatedAt;
        this.activeKey = '';
        this.activeExpire = null;
    }

    forgotPassword(data: any) {
        const { forgotKey, forgotExpire } = data;
        this.forgotKey = forgotKey;
        this.forgotExpire = forgotExpire;
    }

    resetPassword(data: any) {
        const { password, salt, passwordExpired, passwordCreated } = data;
        this.password = password;
        this.salt = salt;
        this.passwordExpired = passwordExpired;
        this.passwordCreated = passwordCreated;
        this.forgotKey = '';
        this.forgotExpire = null;
    }

    confirmedPhone() {
        this.isPhoneConfirmation = true;
    }
}
