import { DashboardDTO } from '../dtos/dashboard';
import { IDashboardStartAndEndDate } from './dashboard.interface';

export interface IDashboardService {
    getStartAndEndDate(date?: DashboardDTO): IDashboardStartAndEndDate;
    getPercentage(value: number, total: number): number;
}
