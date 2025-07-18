import { VNPAY_CLIENT } from '#/common/decorators/inject-vnpay.decorator';
import { AllConfigType } from '#/config';
import { IVnpayConfig } from '#/config/vnpay.config';
import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VnpayModule as NestVnpayModule, VnpayService } from 'nestjs-vnpay';

const providers: Provider[] = [
  {
    provide: VNPAY_CLIENT,
    inject: [VnpayService],
    useFactory: (vnpayService: VnpayService) => {
      return vnpayService;
    },
  },
];

@Module({
  imports: [
    NestVnpayModule.registerAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const vnpayConfig = configService.get<IVnpayConfig>('vnpay');
        return {
          tmnCode: vnpayConfig.tmnCode,
          secureSecret: vnpayConfig.secretKey,
          testMode: true,
          enableLog: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: [...providers],
})
export class VnpayModule {}
