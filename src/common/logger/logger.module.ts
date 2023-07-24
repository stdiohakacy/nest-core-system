import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from 'src/common/logger/services/logger.service';
import { LoggerEntity } from 'src/modules/logger/entities/logger.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LoggerEntity])],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
