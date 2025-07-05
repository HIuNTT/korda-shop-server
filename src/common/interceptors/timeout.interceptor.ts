import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { BYPASS_TIMEOUT_KEY } from '../decorators/bypass-timeout.decorator';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly time: number = 10000,
    private readonly reflector: Reflector,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isBypassTimeout = this.reflector.getAllAndOverride<boolean>(BYPASS_TIMEOUT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isBypassTimeout) {
      return next.handle();
    }

    return next.handle().pipe(
      timeout(this.time),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
