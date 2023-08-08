import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductCreateHandler } from './commands/product.create.command';

const repositories = [ProductRepository];
const commandHandlers = [ProductCreateHandler];
@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity])],
    providers: [...repositories, ...commandHandlers],
    exports: [...repositories],
})
export class ProductModule {}
