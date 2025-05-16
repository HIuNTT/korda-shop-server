import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResOp } from '../model/response.model';
import { Reflector } from '@nestjs/core';
import { BYPASS_KEY } from '../decorators/bypass.decorator';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const isBypass = this.reflector.getAllAndOverride<boolean>(BYPASS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isBypass) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // Transform the response data here
        return new ResOp(HttpStatus.OK, data ?? null);
      }),
    );
  }
}
