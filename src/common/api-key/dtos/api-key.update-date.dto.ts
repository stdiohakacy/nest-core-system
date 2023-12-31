import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { MinDateToday } from '../../../common/request/validations/request.min-date-today.validation';
import { MinGreaterThanEqual } from '../../../common/request/validations/request.min-greater-than-equal.validation';

export class ApiKeyUpdateDateDTO {
    @ApiProperty({
        description: 'Api Key start date',
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
        description: 'Api Key end date',
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
