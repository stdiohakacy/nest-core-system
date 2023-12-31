import { ENUM_RBAC_ROLE_TYPE } from '../../../common/rbac/constants/rbac.enum.role.constant';
import { ENUM_REQUEST_METHOD } from '../../../common/request/constants/request.enum.constant';
import {
    ENUM_LOGGER_ACTION,
    ENUM_LOGGER_LEVEL,
} from '../constants/logger.enum.constant';

export class LoggerCreateDTO {
    action: ENUM_LOGGER_ACTION;
    description: string;
    apiKeyId?: string;
    userId?: string;
    requestId?: string;
    method: ENUM_REQUEST_METHOD;
    path: string;
    // role?: string;
    type?: ENUM_RBAC_ROLE_TYPE;
    tags?: string[];
    params?: Record<string, any>;
    bodies?: Record<string, any>;
    statusCode?: number;
}

export class LoggerCreateRawDTO extends LoggerCreateDTO {
    level: ENUM_LOGGER_LEVEL;
}
