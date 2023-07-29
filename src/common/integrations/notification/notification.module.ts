import { Module } from '@nestjs/common';
import { FCMModule } from './fcm/fcm.module';

@Module({
    imports: [FCMModule],
    exports: [FCMModule],
    providers: [],
})
export class NotificationModule {}
