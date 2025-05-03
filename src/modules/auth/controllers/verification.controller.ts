import { MailerService } from '#/shared/mailer/mailer.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendEmailCodeDto, VerifyEmailCodeDto } from '../dto/auth.dto';
import { InjectRedis } from '#/common/decorators/inject-redis.decorator';
import Redis from 'ioredis';
import { genEmailVerificationCodeKey } from '#/helper/genRedisKey';
import { VerificationService } from '../services/verification.service';

@Controller('otp')
export class VerificationController {
  constructor(
    private mailerService: MailerService,
    private verificationService: VerificationService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Post('email/send')
  @HttpCode(HttpStatus.OK)
  async sendEmailCode(@Body() dto: SendEmailCodeDto): Promise<void> {
    const { email } = dto;
    const { code } = await this.mailerService.sendVerificationCode(email);
    await this.redis.set(genEmailVerificationCodeKey(email), code, 'EX', 10 * 60); // 10 minutes expiration
  }

  @Post('email/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyEmailCode(@Body() dto: VerifyEmailCodeDto): Promise<void> {
    const { email, code } = dto;
    await this.verificationService.checkEmailCode(email, code);
  }
}
