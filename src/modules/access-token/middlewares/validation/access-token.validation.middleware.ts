import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { IRequestApp } from '../../../../common/request/interfaces/request.interface';
import { NextFunction, Response } from 'express';
import { AccessTokenRepository } from '../../repositories/access-token.repository';
import { ENUM_ACCESS_TOKEN_STATUS_CODE_ERROR } from '../../constants/access-token.status-code.constant';

@Injectable()
export class AccessTokenValidationMiddleware implements NestMiddleware {
    constructor(private readonly accessTokenRepo: AccessTokenRepository) {}

    async use(
        req: IRequestApp,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return next();
        }
        const isTokenValid = await this.accessTokenRepo.isTokenRevoke(token);
        if (!isTokenValid) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_ACCESS_TOKEN_STATUS_CODE_ERROR.ACCESS_TOKEN_REVOKE_ERROR,
                message: 'accessToken.error.tokenRevoke',
            });
        }

        next();
    }
}
