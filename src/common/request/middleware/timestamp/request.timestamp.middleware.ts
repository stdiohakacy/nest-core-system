import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IRequestApp } from '../../interfaces/request.interface';
import { HelperNumberService } from 'src/common/helper/services/helper.number.service';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';

@Injectable()
export class RequestTimestampMiddleware implements NestMiddleware {
    constructor(
        private readonly helperNumberService: HelperNumberService,
        private readonly helperDateService: HelperDateService
    ) {}

    async use(
        req: IRequestApp,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        req.__xTimestamp = req['x-timestamp']
            ? this.helperNumberService.create(req['x-timestamp'])
            : undefined;
        req.__timestamp = this.helperDateService.timestamp();
        next();
    }
}
