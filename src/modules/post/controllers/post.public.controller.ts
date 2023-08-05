import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IResponse } from '../../../common/response/interfaces/response.interface';
import { QueryBus } from '@nestjs/cqrs';
import { PostSearchQuery } from '../queries/post.search.query';
import { PostPublicSearchDoc } from '../docs/post.public.doc';
import { Response } from '../../../common/response/decorators/response.decorator';
import { PostSearchDTO } from '../dtos/post.search.dto';

@ApiTags('modules.public.post')
@Controller({ version: '1', path: '/post' })
export class PostPublicController {
    constructor(private readonly queryBus: QueryBus) {}

    @PostPublicSearchDoc()
    @Response('post.search')
    @Post('/search')
    async search(@Body() payload: PostSearchDTO): Promise<IResponse> {
        return await this.queryBus.execute(new PostSearchQuery(payload.text));
    }
}
