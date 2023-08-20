import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { PostService } from '../services/post.service';
import { PostEntity } from '../entities/post.entity';
import { GetOneInput } from '../../../graphql/declare/inputs/custom.input';
import { CurrentQuery } from '../../../graphql/decorators/query.decorator';
import { PostInput } from '../inputs/post.input';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  // @Query(() => GetPlaceType)
  // @UseGuards(new GraphqlPassportAuthGuard('admin'))
  // getManyPlaces(
  //   @Args({ name: 'input', nullable: true })
  //   qs: GetManyInput<Place>,
  //   @CurrentQuery() query: string,
  // ) {
  //   return this.placeService.getMany(qs, query);
  // }

  @Query(() => PostEntity)
  // @UseGuards(new GraphqlPassportAuthGuard('admin'))
  getOne(
    @Args({ name: 'input' })
    qs: GetOneInput<PostEntity>,
    @CurrentQuery() query: string,
  ) {
    return this.postService.getOne(qs, query);
  }

  @Mutation(() => PostEntity)
  // @UseGuards(new GraphqlPassportAuthGuard('admin'))
  create(@Args('input') input: PostInput) {
    return this.postService.create(input);
  }

  @Mutation(() => [PostEntity])
  // @UseGuards(new GraphqlPassportAuthGuard('admin'))
  createMany(
    @Args({ name: 'input', type: () => [PostInput] })
    input: PostInput[],
  ) {
    return this.postService.createMany(input);
  }

  @Mutation(() => PostEntity)
  // @UseGuards(new GraphqlPassportAuthGuard('admin'))
  update(@Args('id') id: string, @Args('input') input: PostInput) {
    return this.postService.update(id, input);
  }

  @Mutation(() => GraphQLJSON)
  // @UseGuards(new GraphqlPassportAuthGuard('admin'))
  delete(@Args('id') id: string) {
    return this.postService.delete(id);
  }
}
