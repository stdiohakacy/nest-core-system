import { Repository } from 'typeorm/repository/Repository';
import { CustomRepository } from '../../../graphql/decorators/typeorm.decorator';
import { PostEntity } from '../entities/post.entity';

@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {}
