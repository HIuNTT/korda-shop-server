import { AuthUser } from '#/modules/auth/decorators/auth-user.decorator';
import { Controller, Get, Query } from '@nestjs/common';
import { VnpayPaymentDto } from './dto/vnpay.dto';
import { CheckoutService } from './checkout.service';
import { CheckoutRes } from './checkout.interface';

@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Get('vnpay-check')
  async checkVnpayPayment(
    @AuthUser() user: IAuthUser,
    @Query() dto: VnpayPaymentDto,
  ): Promise<CheckoutRes> {
    return this.checkoutService.checkVnpayPayment(user.uid, dto);
  }
}
