import { ConfigType, registerAs } from '@nestjs/config';
import { env, envNumber } from './env';
import SMTPConnection from 'nodemailer/lib/smtp-connection';

export const mailerRegToken = 'mailer';

export const MailerConfig = registerAs(
  mailerRegToken,
  (): SMTPConnection.Options => ({
    host: env('SMTP_HOST'),
    port: envNumber('SMTP_PORT'),
    secure: false,
    auth: {
      user: env('SMTP_USER'),
      pass: env('SMTP_PASS'),
    },
  }),
);

export type IMailerConfig = ConfigType<typeof MailerConfig>;
