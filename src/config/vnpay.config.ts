import { ConfigType, registerAs } from '@nestjs/config';
import { env } from './env';

export const vnpayRegToken = 'vnpay';

export const VnpayConfig = registerAs(vnpayRegToken, () => ({
  tmnCode: env('VNPAY_TMN_CODE'),
  secretKey: env('VNPAY_SECRET_KEY'),
  returnUrl: env('VNPAY_RETURN_URL'),
}));

export type IVnpayConfig = ConfigType<typeof VnpayConfig>;
