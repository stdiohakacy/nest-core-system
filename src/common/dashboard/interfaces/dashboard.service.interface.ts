import { DashboardDto } from '../dtos/dashboard';
import { IDashboardStartAndEndDate } from './dashboard.interface';

export interface IDashboardService {
    getStartAndEndDate(date?: DashboardDto): IDashboardStartAndEndDate;
    getPercentage(value: number, total: number): number;
}
