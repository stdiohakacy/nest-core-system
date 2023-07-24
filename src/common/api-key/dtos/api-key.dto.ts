import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { BaseDTO } from 'src/common/base/dto/base.dto';
import { MinDateToday } from 'src/common/request/validations/request.min-date-today.validation';
import { MinGreaterThanEqual } from 'src/common/request/validations/request.min-greater-than-equal.validation';

export class ApiKeyDTO extends BaseDTO {
    @ApiProperty({
        description: 'Api key start date',
        example: faker.date.recent(),
        required: false,
        nullable: true,
    })
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    @MinDateToday()
    startDate: Date;

    @ApiProperty({
        description: 'Api key end date',
        example: faker.date.recent(),
        required: false,
        nullable: true,
    })
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    @MinGreaterThanEqual('startDate')
    endDate: Date;
}
