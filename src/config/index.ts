import { AppConfig, appRegToken, IAppConfig } from './app.config';
import { AzureConfig, azureRegToken, IAzureConfig } from './azure.config';
import { DatabaseConfig, dbRegToken, IDatabaseConfig } from './database.config';
import { GoogleConfig, googleRegToken, IGoogleConfig } from './google.config';
import { IMailerConfig, MailerConfig, mailerRegToken } from './mailer.config';
import { IRedisConfig, RedisConfig, redisRegToken } from './redis.config';
import { ISecurityConfig, SecurityConfig, securityRegToken } from './security.config';
import { ISwaggerConfig, SwaggerConfig, swaggerRegToken } from './swagger.config';

export * from './database.config';
export * from './redis.config';
export * from './google.config';
export * from './security.config';
export * from './mailer.config';
export * from './app.config';
export * from './swagger.config';
export * from './azure.config';

export interface AllConfigType {
  [dbRegToken]: IDatabaseConfig;
  [redisRegToken]: IRedisConfig;
  [googleRegToken]: IGoogleConfig;
  [securityRegToken]: ISecurityConfig;
  [mailerRegToken]: IMailerConfig;
  [appRegToken]: IAppConfig;
  [swaggerRegToken]: ISwaggerConfig;
  [azureRegToken]: IAzureConfig;
}

export default {
  DatabaseConfig,
  RedisConfig,
  GoogleConfig,
  SecurityConfig,
  MailerConfig,
  AppConfig,
  SwaggerConfig,
  AzureConfig,
};
