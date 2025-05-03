import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { IMailerConfig, mailerRegToken } from '#/config/mailer.config';
import { join } from 'node:path';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: configService.get<IMailerConfig>(mailerRegToken),
        defaults: {
          from: {
            name: 'Korda',
            address: configService.get<IMailerConfig>(mailerRegToken).auth.user,
          },
        },
        template: {
          dir: join(__dirname, '..', '..', '/assets/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
