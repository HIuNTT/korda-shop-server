import { REDIS_CLIENT } from '#/common/decorators/inject-redis.decorator';
import { IRedisConfig, redisRegToken } from '#/config';
import { RedisService, RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';
import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const providers: Provider[] = [
  {
    provide: REDIS_CLIENT,
    inject: [RedisService],
    useFactory: (redisService: RedisService) => {
      return redisService.getOrThrow();
    },
  },
];

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        readyLog: true,
        config: configService.get<IRedisConfig>(redisRegToken),
      }),
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: [...providers],
})
export class RedisModule {}
