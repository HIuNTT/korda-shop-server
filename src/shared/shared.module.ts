import { Global, Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { MailerModule } from './mailer/mailer.module';

@Global()
@Module({
  imports: [RedisModule, MailerModule],
  exports: [RedisModule, MailerModule],
})
export class SharedModule {}
