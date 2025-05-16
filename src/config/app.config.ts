import { ConfigType, registerAs } from '@nestjs/config';
import { env, envNumber } from './env';

export const appRegToken = 'app';

export const AppConfig = registerAs(appRegToken, () => ({
  name: env('APP_NAME'),
  port: envNumber('APP_PORT', 3000),
  baseUrl: env('APP_BASE_URL'),
  globalPrefix: env('GLOBAL_PREFIX', 'api'),
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
