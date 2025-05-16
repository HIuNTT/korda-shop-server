import { Global, Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { MailerModule } from './mailer/mailer.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Global()
@Module({
  imports: [
    // rate limit
    ThrottlerModule.forRoot({
      errorMessage: 'Too many requests, please try again later.',
      throttlers: [
        {
          ttl: 60000,
          limit: 20,
        },
      ],
    }),
    RedisModule,
    MailerModule,
  ],
  exports: [RedisModule, MailerModule],
})
export class SharedModule {}
