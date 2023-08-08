import { Column, Entity } from 'typeorm';

import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { ProductDTO } from '../dtos/product.dto';

export interface IProductEntity extends IBaseEntity<ProductDTO> {
    readonly name: string;
    readonly price: number;
    readonly description: string;
    readonly inStock: boolean;
}

@Entity({ name: 'products' })
@UseDTO(ProductDTO)
export class ProductEntity
    extends BaseEntity<ProductDTO>
    implements IProductEntity
{
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'price' })
    price: number;

    @Column({ name: 'description' })
    description: string;

    @Column({ name: 'inStock' })
    inStock: boolean;
}
