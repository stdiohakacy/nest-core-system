import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ApiKeyService } from 'src/common/api-key/services/api-key.service';
import { ApiKeyEntity } from 'src/modules/api-key/entities/api-key.entity';

@Injectable()
export class ApiKeyPutToRequestGuard implements CanActivate {
    constructor(private readonly apiKeyService: ApiKeyService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { apiKey } = params;

        const check: ApiKeyEntity = await this.apiKeyService.findOneById(
            apiKey
        );
        request.__apiKey = check;

        return true;
    }
}
