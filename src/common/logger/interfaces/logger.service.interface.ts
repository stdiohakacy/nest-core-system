import { LoggerEntity } from '../../../modules/logger/entities/logger.entity';
import { LoggerCreateDTO, LoggerCreateRawDTO } from '../dtos/logger.create.dto';

export interface ILoggerService {
    info({
        action,
        description,
        apiKeyId,
        userId,
        method,
        requestId,
        // role,
        type,
        params,
        bodies,
        path,
        statusCode,
        tags,
    }: LoggerCreateDTO): Promise<LoggerEntity>;
    debug({
        action,
        description,
        apiKeyId,
        userId,
        method,
        requestId,
        // role,
        type,
        params,
        bodies,
        path,
        statusCode,
        tags,
    }: LoggerCreateDTO): Promise<LoggerEntity>;
    warn({
        action,
        description,
        apiKeyId,
        userId,
        method,
        requestId,
        // role,
        type,
        params,
        bodies,
        path,
        statusCode,
        tags,
    }: LoggerCreateDTO): Promise<LoggerEntity>;
    fatal({
        action,
        description,
        apiKeyId,
        userId,
        method,
        requestId,
        // role,
        type,
        params,
        bodies,
        path,
        statusCode,
        tags,
    }: LoggerCreateDTO): Promise<LoggerEntity>;
    raw({
        level,
        action,
        description,
        apiKeyId,
        userId,
        method,
        requestId,
        // role,
        type,
        params,
        bodies,
        path,
        statusCode,
        tags,
    }: LoggerCreateRawDTO): Promise<LoggerEntity>;
}
