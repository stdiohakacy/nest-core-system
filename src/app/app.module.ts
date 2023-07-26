import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { AppController } from './controllers/app.controller';
import { CommonModule } from '../common/common.module';
import { RouterModule } from '../router/router.module';

@Module({
    controllers: [AppController],
    providers: [],
    imports: [CommonModule, JobsModule.forRoot(), RouterModule.forRoot()],
    exports: [CommonModule, JobsModule.forRoot(), RouterModule.forRoot()],
})
export class AppModule {}
