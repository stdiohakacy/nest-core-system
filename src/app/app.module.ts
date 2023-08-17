import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { AppController } from './controllers/app.controller';
import { CommonModule } from '../common/common.module';
import { RouterModule } from '../router/router.module';
import { SocketStateService } from '../common/pub-sub/socket-state/socket-state.service';

@Module({
    controllers: [AppController],
    providers: [SocketStateService],
    imports: [CommonModule, JobsModule.forRoot(), RouterModule.forRoot()],
    exports: [CommonModule, JobsModule.forRoot(), RouterModule.forRoot()],
})
export class AppModule {}
