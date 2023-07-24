import { Module } from '@nestjs/common';
import { JobsModule } from 'src/jobs/jobs.module';
import { AppController } from './controllers/app.controller';
import { RouterModule } from 'src/router/router.module';
import { CommonModule } from 'src/common/common.module';

@Module({
    controllers: [AppController],
    providers: [],
    imports: [CommonModule, JobsModule.forRoot(), RouterModule.forRoot()],
    exports: [CommonModule, JobsModule.forRoot(), RouterModule.forRoot()],
})
export class AppModule {}
