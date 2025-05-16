import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(erros: string[]) {
    super(erros, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
