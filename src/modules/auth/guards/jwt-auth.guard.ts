import { InjectRedis } from '#/common/decorators/inject-redis.decorator';
import { PUBLIC_KEY } from '#/modules/auth/decorators/public.decorator';
import { AuthStrategy } from '#/constants/auth.constant';
import { genTokenBlacklistKey } from '#/helper/genRedisKey';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import Redis from 'ioredis';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  jwtFromRequestFn = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(
    private reflector: Reflector,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();

    const token = this.jwtFromRequestFn(request);

    if (await this.redis.get(genTokenBlacklistKey(token)))
      throw new UnauthorizedException('Đăng nhập không hợp lệ! Vui lòng đăng nhập lại!');

    request.accessToken = token;

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
