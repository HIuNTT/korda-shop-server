import { DatabaseConfig } from './database.config';
import { GoogleConfig } from './google.config';
import { MailerConfig } from './mailer.config';
import { RedisConfig } from './redis.config';
import { SecurityConfig } from './security.config';

export * from './database.config';
export * from './redis.config';
export * from './google.config';
export * from './security.config';
export * from './mailer.config';

export default {
  DatabaseConfig,
  RedisConfig,
  GoogleConfig,
  SecurityConfig,
  MailerConfig,
};
