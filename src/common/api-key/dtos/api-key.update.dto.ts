import { PickType } from '@nestjs/swagger';
import { ApiKeyCreateDTO } from './api-key.create.dto';

export class ApiKeyUpdateDTO extends PickType(ApiKeyCreateDTO, [
    'name',
] as const) {}
