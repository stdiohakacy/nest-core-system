import { Column, Entity } from 'typeorm';

import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';

import { CategoryDTO } from '../dtos/category.dto';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';

export interface ICategoryEntity extends IBaseEntity<CategoryDTO> {
    name: string;
    description: string;
}

@Entity({ name: 'categories' })
@UseDTO(CategoryDTO)
export class CategoryEntity
    extends BaseEntity<CategoryDTO>
    implements ICategoryEntity
{
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description' })
    description: string;
}
