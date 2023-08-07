// elasticsearch.exception-filter.ts
import {
    Catch,
    ArgumentsHost,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { ElasticsearchClientError } from '@elastic/elasticsearch/lib/errors';

@Catch(ElasticsearchClientError)
export class ElasticsearchCoreFilter implements ExceptionFilter {
    catch(exception: ElasticsearchClientError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: 'Elasticsearch server error',
        });
    }
}
