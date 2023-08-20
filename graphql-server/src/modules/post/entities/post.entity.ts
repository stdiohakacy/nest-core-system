import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../../graphql/base/base.entity';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity({ name: 'posts' })
export class PostEntity extends BaseEntity {
  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  content: string;
}
