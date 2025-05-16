import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ValidationException } from '../exceptions/validation.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const url = request.originalUrl;

    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(exception, undefined, 'CatchAllExceptionsFilter');
    } else {
      this.logger.warn(`Error message: [${status}] - ${message} Path: ${decodeURI(url)}`);
    }

    response.status(status).json({
      status_code: status,
      message,
    });
  }

  getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  getMessage(exception: unknown) {
    if (exception instanceof ValidationException) {
      return exception.getResponse();
    } else if (exception instanceof HttpException) {
      return exception.message;
    } else if (exception instanceof QueryFailedError) {
      return exception.message;
    }
  }
}
