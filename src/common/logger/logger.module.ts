import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from '@common/logger/services/logger.service';
import { LoggerEntity } from '@modules/logger/entities/logger.entity';

@Module({
    imports: [TypeOrmModule.forFeature([LoggerEntity])],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
