import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { RoleEntity } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity])],
    controllers: [],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
