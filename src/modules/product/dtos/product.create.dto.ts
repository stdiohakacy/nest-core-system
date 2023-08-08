import { PickType } from '@nestjs/swagger';
import { ProductDTO } from './product.dto';

export class ProductCreateDTO extends PickType(ProductDTO, [
    'name',
    'price',
    'description',
    'inStock',
]) {}
