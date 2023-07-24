import { Module } from '@nestjs/common';
import { DatabaseOptionService } from './services/database.options.service';

@Module({
    providers: [DatabaseOptionService],
    exports: [DatabaseOptionService],
    imports: [],
    controllers: [],
})
export class DatabaseOptionsModule {}
