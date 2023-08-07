import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';

const repositories = [CategoryRepository];

@Module({
    imports: [TypeOrmModule.forFeature([CategoryEntity])],
    providers: [...repositories],
    exports: [...repositories],
})
export class CategoryModule {}
