import { AuthUser } from '#/modules/auth/decorators/auth-user.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VnpayPaymentDto } from './dto/vnpay.dto';
import { CheckoutService } from './checkout.service';
import { CheckoutRes } from './checkout.interface';
import { Public } from '#/modules/auth/decorators/public.decorator';
import { Bypass } from '#/common/decorators/bypass.decorator';
import { TransferPaymentDto } from './dto/transfer.dto';

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

  @Public()
  @Bypass()
  @Post('transfer-check')
  async checkTransferPayment(@Body() dto: TransferPaymentDto) {
    return this.checkoutService.checkTransferPayment(dto);
  }
}
