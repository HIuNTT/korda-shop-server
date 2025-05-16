import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name, { timestamp: true });

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const content = `${request.method} -> ${request.url}`;
    this.logger.debug(`+++ Request: ${content}`);
    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => this.logger.debug(`--- Response: ${content} - ${Date.now() - now}ms`)));
  }
}
