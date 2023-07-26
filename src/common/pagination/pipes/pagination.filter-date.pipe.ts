import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { IPaginationFilterDateOptions } from '../interfaces/pagination.interface';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import { PaginationService } from '../services/pagination.service';
import { HelperDateService } from '../../../common/helper/services/helper.date.service';
import { ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS } from '../constants/pagination.enum.constant';

export function PaginationFilterDatePipe(
    field: string,
    raw: boolean,
    options?: IPaginationFilterDateOptions
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationFilterDatePipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService,
            private readonly helperDateService: HelperDateService
        ) {}

        async transform(value: string): Promise<Record<string, Date | string>> {
            if (!value) {
                return undefined;
            }

            let date: Date = this.helperDateService.create(value);

            if (
                options?.time ===
                ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS.END_OF_DAY
            ) {
                date = this.helperDateService.endOfDay(date);
            } else if (
                options?.time ===
                ENUM_PAGINATION_FILTER_DATE_TIME_OPTIONS.START_OF_DAY
            ) {
                date = this.helperDateService.startOfDay(date);
            }

            if (raw) {
                return {
                    [field]: value,
                };
            }

            return this.paginationService.filterDate(field, date);
        }
    }

    return mixin(MixinPaginationFilterDatePipe);
}
