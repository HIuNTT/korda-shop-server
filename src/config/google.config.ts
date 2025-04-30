import { ConfigType, registerAs } from '@nestjs/config';
import { env } from './env';

export const googleRegToken = 'google';

export const GoogleConfig = registerAs(googleRegToken, () => ({
  clientId: env('GOOGLE_CLIENT_ID'),
  clientSecret: env('GOOGLE_CLIENT_SECRET'),
}));

export type IGoogleConfig = ConfigType<typeof GoogleConfig>;
