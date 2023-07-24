import { DashboardDto } from '@common/dashboard/dtos/dashboard';
import { IDashboardStartAndEndDate } from '@common/dashboard/interfaces/dashboard.interface';

export interface IDashboardService {
    getStartAndEndDate(date?: DashboardDto): IDashboardStartAndEndDate;
    getPercentage(value: number, total: number): number;
}
