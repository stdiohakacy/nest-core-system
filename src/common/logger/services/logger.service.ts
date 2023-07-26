import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILoggerService } from '../interfaces/logger.service.interface';
import { LoggerEntity } from '../../../modules/logger/entities/logger.entity';
import { LoggerCreateDTO, LoggerCreateRawDTO } from '../dtos/logger.create.dto';
import { ENUM_LOGGER_LEVEL } from '../constants/logger.enum.constant';

@Injectable()
export class LoggerService implements ILoggerService {
    constructor(
        @InjectRepository(LoggerEntity)
        private readonly loggerRepo: Repository<LoggerEntity>
    ) {}

    async info({
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
    }: LoggerCreateDTO): Promise<LoggerEntity> {
        const create: LoggerEntity = new LoggerEntity();
        create.level = ENUM_LOGGER_LEVEL.INFO;
        create.userId = userId;
        create.apiKeyId = apiKeyId;
        create.anonymous = !userId;
        create.action = action;
        create.description = description;
        create.method = method;
        create.requestId = requestId;
        // create.role = role;
        create.type = type;
        create.params = params;
        create.bodies = bodies;
        create.path = path;
        create.statusCode = statusCode;
        create.tags = tags;

        return this.loggerRepo.save<LoggerEntity>(create);
    }

    async debug({
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
    }: LoggerCreateDTO): Promise<LoggerEntity> {
        const create: LoggerEntity = new LoggerEntity();
        create.level = ENUM_LOGGER_LEVEL.DEBUG;
        create.userId = userId;
        create.apiKeyId = apiKeyId;
        create.anonymous = !userId;
        create.action = action;
        create.description = description;
        create.method = method;
        create.requestId = requestId;
        // create.role = role;
        create.type = type;
        create.params = params;
        create.bodies = bodies;
        create.path = path;
        create.statusCode = statusCode;
        create.tags = tags;

        return this.loggerRepo.save<LoggerEntity>(create);
    }

    async warn({
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
    }: LoggerCreateDTO): Promise<LoggerEntity> {
        const create: LoggerEntity = new LoggerEntity();
        create.level = ENUM_LOGGER_LEVEL.WARN;
        create.userId = userId;
        create.apiKeyId = apiKeyId;
        create.anonymous = !userId;
        create.action = action;
        create.description = description;
        create.method = method;
        create.requestId = requestId;
        // create.role = role;
        create.type = type;
        create.params = params;
        create.bodies = bodies;
        create.path = path;
        create.statusCode = statusCode;
        create.tags = tags;

        return this.loggerRepo.save<LoggerEntity>(create);
    }

    async fatal({
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
    }: LoggerCreateDTO): Promise<LoggerEntity> {
        const create: LoggerEntity = new LoggerEntity();
        create.level = ENUM_LOGGER_LEVEL.FATAL;
        create.userId = userId;
        create.apiKeyId = apiKeyId;
        create.anonymous = !userId;
        create.action = action;
        create.description = description;
        create.method = method;
        create.requestId = requestId;
        // create.role = role;
        create.type = type;
        create.params = params;
        create.bodies = bodies;
        create.path = path;
        create.statusCode = statusCode;
        create.tags = tags;

        return this.loggerRepo.save<LoggerEntity>(create);
    }

    async raw({
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
    }: LoggerCreateRawDTO): Promise<LoggerEntity> {
        const create: LoggerEntity = new LoggerEntity();
        create.level = level;
        create.userId = userId;
        create.apiKeyId = apiKeyId;
        create.anonymous = !userId;
        create.action = action;
        create.description = description;
        create.method = method;
        create.requestId = requestId;
        // create.role = role;
        create.type = type;
        create.params = params;
        create.bodies = bodies;
        create.path = path;
        create.statusCode = statusCode;
        create.tags = tags;

        return this.loggerRepo.save<LoggerEntity>(create);
    }
}
