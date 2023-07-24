import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface IDatabaseOptionService {
    createOption(): TypeOrmModuleOptions;
}
