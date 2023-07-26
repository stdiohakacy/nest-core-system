import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { UserProfileSerialization } from './user.profile.serialization';
import { RoleListSerialization } from '../../../modules/role/serializations/role.list.serialization';
import { AwsS3Serialization } from '../../../common/aws/serializations/aws.s3.serialization';
export class UserListSerialization extends OmitType(UserProfileSerialization, [
    'photo',
    'signUpDate',
    'signUpFrom',
    'role',
] as const) {
    @ApiProperty({
        type: () => RoleListSerialization,
        required: true,
        nullable: false,
    })
    @Type(() => RoleListSerialization)
    readonly role: RoleListSerialization;

    @ApiHideProperty()
    @Exclude()
    readonly photo?: AwsS3Serialization;

    @ApiHideProperty()
    @Exclude()
    readonly signUpDate: Date;
}
