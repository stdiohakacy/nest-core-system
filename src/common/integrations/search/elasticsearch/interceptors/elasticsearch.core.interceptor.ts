// elasticsearch.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ElasticsearchCoreInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                // Check if the error is related to network connectivity
                if (
                    error.code === 'ECONNREFUSED' ||
                    error.code === 'ECONNRESET'
                ) {
                    return throwError('Network connectivity error');
                }
                return throwError(error);
            })
        );
    }
}
