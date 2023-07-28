import { ApiHideProperty, ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { UserProfileSerialization } from './user.profile.serialization';
import { AwsS3Serialization } from '../../../common/aws/serializations/aws.s3.serialization';
export class UserListSerialization extends OmitType(UserProfileSerialization, [
    'photo',
    'signUpDate',
    'signUpFrom',
] as const) {
    @ApiHideProperty()
    @Exclude()
    readonly photo?: AwsS3Serialization;

    @ApiHideProperty()
    @Exclude()
    readonly signUpDate: Date;
}
