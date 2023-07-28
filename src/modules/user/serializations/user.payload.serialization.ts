import { faker } from '@faker-js/faker';
import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

import { UserProfileSerialization } from './user.profile.serialization';
import { AwsS3Serialization } from '../../../common/aws/serializations/aws.s3.serialization';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { ENUM_RBAC_ROLE_TYPE } from 'src/common/rbac/constants/rbac.enum.role.constant';

export class UserPayloadSerialization extends OmitType(
    UserProfileSerialization,
    ['photo', 'signUpDate', 'createdAt', 'updatedAt'] as const
) {
    @ApiHideProperty()
    @Exclude()
    readonly photo?: AwsS3Serialization;

    @ApiProperty({
        example: [faker.string.uuid()],
        type: 'string',
        isArray: true,
        required: true,
        nullable: false,
    })
    @Transform(({ obj }) => `${obj.role._id}`)
    readonly role: string;

    @ApiProperty({
        example: ENUM_RBAC_ROLE_TYPE.ADMIN,
        type: 'string',
        enum: ENUM_RBAC_ROLE_TYPE,
        required: true,
        nullable: false,
    })
    @Expose()
    @Transform(({ obj }) => obj.role.type)
    readonly type: ENUM_RBAC_ROLE_TYPE;

    @ApiHideProperty()
    @Exclude()
    readonly signUpDate: Date;

    @ApiHideProperty()
    @Exclude()
    readonly signUpFrom: ENUM_USER_SIGN_UP_FROM;

    @ApiProperty({
        required: true,
        nullable: false,
        example: faker.date.recent(),
    })
    @Expose()
    readonly loginDate: Date;

    @ApiHideProperty()
    @Exclude()
    readonly createdAt: number;

    @ApiHideProperty()
    @Exclude()
    readonly updatedAt: number;
}
