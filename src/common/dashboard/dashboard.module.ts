import { Module } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';

@Module({
    controllers: [],
    providers: [DashboardService],
    exports: [DashboardService],
    imports: [],
})
export class DashboardModule {}
