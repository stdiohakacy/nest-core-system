import { BaseEntity, IBaseEntity } from 'src/common/base/entity/base.entity';
import { UseDTO } from 'src/common/decorators/use-dto.decorator';
import {
    ENUM_LOGGER_ACTION,
    ENUM_LOGGER_LEVEL,
} from 'src/common/logger/constants/logger.enum.constant';
import { LoggerDTO } from 'src/common/logger/dtos/logger.dto';
import { ENUM_REQUEST_METHOD } from 'src/common/request/constants/request.enum.constant';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';
import { Column, Entity } from 'typeorm';

export interface ILoggerEntity extends IBaseEntity<LoggerDTO> {
    level: ENUM_LOGGER_LEVEL;
    action: ENUM_LOGGER_ACTION;
    method: ENUM_REQUEST_METHOD;
    anonymous: boolean;
    description: string;
    tags: string[];
    requestId?: string;
    userId?: string;
    apiKeyId?: string;
    type?: ENUM_ROLE_TYPE;
    params?: Record<string, any>;
    bodies?: Record<string, any>;
    statusCode?: number;
    path?: string;
}

@Entity({ name: 'loggers' })
@UseDTO(LoggerDTO)
export class LoggerEntity
    extends BaseEntity<LoggerDTO>
    implements ILoggerEntity
{
    @Column({
        name: 'level',
        enum: ENUM_LOGGER_LEVEL,
        default: ENUM_LOGGER_LEVEL.DEBUG,
    })
    level: ENUM_LOGGER_LEVEL;

    @Column({
        name: 'action',
        enum: ENUM_LOGGER_ACTION,
        default: ENUM_LOGGER_ACTION.TEST,
    })
    action: ENUM_LOGGER_ACTION;

    @Column({
        name: 'method',
        enum: ENUM_REQUEST_METHOD,
        default: ENUM_REQUEST_METHOD.GET,
    })
    method: ENUM_REQUEST_METHOD;

    @Column({ name: 'anonymous', default: false })
    anonymous: boolean;

    @Column({ name: 'description', default: '' })
    description: string;

    @Column({ name: 'description', type: 'jsonb', default: [] })
    tags: string[];

    @Column({ name: 'requestId', type: 'uuid', nullable: true })
    requestId?: string;

    @Column({ name: 'userId', type: 'uuid', nullable: true })
    userId?: string;

    @Column({ name: 'apiKeyId', type: 'uuid', nullable: true })
    apiKeyId?: string;

    @Column({
        name: 'type',
        enum: ENUM_ROLE_TYPE,
        default: ENUM_ROLE_TYPE.USER,
    })
    type?: ENUM_ROLE_TYPE;

    @Column({
        name: 'params',
        type: 'jsonb',
        default: {},
    })
    params?: Record<string, any>;

    @Column({
        name: 'params',
        type: 'jsonb',
        default: {},
    })
    bodies?: Record<string, any>;

    @Column({
        name: 'statusCode',
        default: 200,
    })
    statusCode?: number;

    @Column({
        name: 'path',
        default: '',
    })
    path?: string;
}
