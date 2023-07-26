import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerEntity } from '../../modules/logger/entities/logger.entity';
import { LoggerService } from './services/logger.service';

@Module({
    imports: [TypeOrmModule.forFeature([LoggerEntity])],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
