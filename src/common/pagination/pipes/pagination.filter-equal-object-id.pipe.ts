import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { isUUID } from 'class-validator';
import { IRequestApp } from '../../../common/request/interfaces/request.interface';
import { PaginationService } from '../services/pagination.service';
// import { Types } from 'mongoose';

export function PaginationFilterEqualObjectIdPipe(
    field: string,
    raw: boolean
): Type<PipeTransform> {
    @Injectable({ scope: Scope.REQUEST })
    class MixinPaginationFilterEqualObjectIdPipe implements PipeTransform {
        constructor(
            @Inject(REQUEST) protected readonly request: IRequestApp,
            private readonly paginationService: PaginationService
        ) {}

        async transform(value: string): Promise<Record<string, string>> {
            if (!value) {
                return undefined;
            }

            value = value.trim();
            const finalValue = isUUID(value) ? value : value;

            if (raw) {
                return {
                    [field]: value,
                };
            }

            return this.paginationService.filterEqual<string | string>(
                field,
                finalValue
            );
        }
    }

    return mixin(MixinPaginationFilterEqualObjectIdPipe);
}
