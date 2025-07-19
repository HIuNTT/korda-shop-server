import { RESPONSE_SUCCESS_MESSAGE } from '#/constants/response.constant';

export class ResOp<T = any> {
  data: T;
  status_code: number;
  message: string;

  constructor(statusCode: number, data: T, message = RESPONSE_SUCCESS_MESSAGE) {
    this.data = data;
    this.status_code = statusCode;
    this.message = message;
  }
}
