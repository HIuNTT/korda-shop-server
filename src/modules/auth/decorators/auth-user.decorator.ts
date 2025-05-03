import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * @description Get the currently logged in user information and attach it to the request object
 */
export const AuthUser = createParamDecorator((data: keyof IAuthUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const user = request.user as IAuthUser;

  return data ? user?.[data] : user;
});
