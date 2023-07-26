import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { HelperDateService } from '../../../common/helper/services/helper.date.service';
import { ENUM_API_KEY_STATUS_CODE_ERROR } from '../constants/api-key.status-code.constant';

@Injectable()
export class ApiKeyExpiredGuard implements CanActivate {
    constructor(private readonly helperDateService: HelperDateService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __apiKey } = context.switchToHttp().getRequest();
        const today: Date = this.helperDateService.create();

        if (
            __apiKey.startDate &&
            __apiKey.endDate &&
            today > __apiKey.endDate
        ) {
            throw new BadRequestException({
                statusCode:
                    ENUM_API_KEY_STATUS_CODE_ERROR.API_KEY_EXPIRED_ERROR,
                message: 'apiKey.error.expired',
            });
        }
        return true;
    }
}
