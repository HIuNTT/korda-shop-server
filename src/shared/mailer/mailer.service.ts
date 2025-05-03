import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { randomValue } from '#/utils/tool.util';

@Injectable()
export class MailerService {
  constructor(private mailerService: NestMailerService) {}

  async sendVerificationCode(to: string, code = randomValue(6, '1234567890')) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: '[Korda] Mã xác thực email',
        template: 'verification-code',
        context: {
          code,
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Gửi mã xác thực thất bại!');
    }

    return {
      code,
    };
  }
}
