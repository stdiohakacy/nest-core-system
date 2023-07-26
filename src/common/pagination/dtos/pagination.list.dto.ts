import { ApiHideProperty } from '@nestjs/swagger';
import { IPaginationOrder } from '../interfaces/pagination.interface';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../constants/pagination.enum.constant';

export class PaginationListDTO {
    @ApiHideProperty()
    _search: Record<string, any>;

    @ApiHideProperty()
    _limit: number;

    @ApiHideProperty()
    _offset: number;

    @ApiHideProperty()
    _order: IPaginationOrder;

    @ApiHideProperty()
    _availableOrderBy: string[];

    @ApiHideProperty()
    _availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[];
}
