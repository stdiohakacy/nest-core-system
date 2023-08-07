import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerEntity } from '../../modules/logger/entities/logger.entity';
import { LoggerService } from './services/logger.service';
import { LogstashService } from './services/logger.logstash.service';

@Module({
    imports: [TypeOrmModule.forFeature([LoggerEntity])],
    providers: [LoggerService, LogstashService],
    exports: [LoggerService, LogstashService],
})
export class LoggerModule {}
