import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessagePublicLanguageDoc } from '@common/message/docs/message.public.doc';
import { MessageLanguageSerialization } from '@common/message/serializations/message.language.serialization';
import { MessageService } from '@common/message/services/message.service';
import { Response } from '@common/response/decorators/response.decorator';
import { IResponse } from '@common/response/interfaces/response.interface';

@ApiTags('common.public.message')
@Controller({
    version: VERSION_NEUTRAL,
    path: '/message',
})
export class MessagePublicController {
    constructor(private readonly messageService: MessageService) {}

    @MessagePublicLanguageDoc()
    @Response('message.languages', {
        serialization: MessageLanguageSerialization,
    })
    @Get('/languages')
    async languages(): Promise<IResponse> {
        const languages: string[] = this.messageService.getAvailableLanguages();

        return {
            data: { languages },
        };
    }
}
