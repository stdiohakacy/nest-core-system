import { Column, Entity } from 'typeorm';
import {
    BaseEntity,
    IBaseEntity,
} from '../../../common/base/entity/base.entity';
import { UseDTO } from '../../../common/decorators/use-dto.decorator';
import { PostDTO } from '../dtos/post.dto';

export interface IPostEntity extends IBaseEntity<PostDTO> {
    title: string;
    content: string;
}

@Entity({ name: 'posts' })
@UseDTO(PostDTO)
export class PostEntity extends BaseEntity<PostDTO> implements IPostEntity {
    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'content' })
    content: string;
}
