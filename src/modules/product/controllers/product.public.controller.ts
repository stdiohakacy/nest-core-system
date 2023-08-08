import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductRepository } from '../repositories/product.repository';
import { Transactional } from 'typeorm-transactional';
import { IResponse } from '../../../common/response/interfaces/response.interface';
import { Response } from '../../../common/response/decorators/response.decorator';
import { ProductCreateDTO } from '../dtos/product.create.dto';
import { ProductPublicCreateDoc } from '../docs/product.public.doc';
import { CommandBus } from '@nestjs/cqrs';
import { ProductCreateCommand } from '../commands/product.create.command';

@ApiTags('modules.public.product')
@Controller({ version: '1', path: '/product' })
export class ProductPublicController {
    constructor(private readonly commandBus: CommandBus) {}

    @ProductPublicCreateDoc()
    @Response('product.create')
    @Transactional()
    @Post('/')
    async create(
        @Body()
        payload: ProductCreateDTO
    ): Promise<IResponse> {
        return await this.commandBus.execute(new ProductCreateCommand(payload));
    }
}
