import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IRequestApp } from '../../interfaces/request.interface';
import { DatabaseDefaultUUID } from '../../../../common/database/constants/database.function.constant';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    async use(
        req: IRequestApp,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const uuid: string = DatabaseDefaultUUID();

        req.__id = uuid;
        next();
    }
}
