import { InjectRedis } from '#/common/decorators/inject-redis.decorator';
import { genEmailVerificationCodeKey, genVerifiedEmailKey } from '#/helper/genRedisKey';
import { BadRequestException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class VerificationService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async checkEmailCode(email: string, code: string): Promise<void> {
    const resultCode = await this.redis.get(genEmailVerificationCodeKey(email));
    if (resultCode !== code) {
      throw new BadRequestException('Mã xác thực không hợp lệ!');
    }
    await this.redis.set(genVerifiedEmailKey(email), 'true', 'EX', 20 * 60);
    await this.redis.del(genEmailVerificationCodeKey(email));
  }
}
