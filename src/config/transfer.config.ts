import { ConfigType, registerAs } from '@nestjs/config';
import { env } from './env';

export const transferRegToken = 'transfer';

export const TransferConfig = registerAs(transferRegToken, () => ({
  bankName: env('TRANSFER_BANK_NAME'),
  account: env('TRANSFER_ACCOUNT'),
  qrCodePrefix: env('TRANSFER_QR_CODE_PREFIX'),
}));

export type ITransferConfig = ConfigType<typeof TransferConfig>;
