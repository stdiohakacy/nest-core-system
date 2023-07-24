import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingService } from './services/setting.service';
import { SettingEntity } from '@modules/setting/entities/setting.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SettingEntity])],
    providers: [SettingService],
    exports: [SettingService],
    controllers: [],
})
export class SettingModule {}
