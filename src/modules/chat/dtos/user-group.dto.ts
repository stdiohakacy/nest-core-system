import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto/base.dto';

export class UserGroupDTO extends BaseDTO {
    @ApiProperty({
        name: 'userId',
        description: 'User group userId',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly userId: string;

    @ApiProperty({
        name: 'groupId',
        description: 'User group groupId',
        example: faker.string.uuid(),
        required: true,
        nullable: false,
    })
    @IsNotEmpty()
    @IsUUID()
    @Type(() => String)
    readonly groupId: string;
}
