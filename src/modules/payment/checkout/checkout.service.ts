import { BadRequestException, Injectable } from '@nestjs/common';
import { VnpayPaymentDto } from './dto/vnpay.dto';
import { OrderService } from '#/modules/order/order.service';
import { OrderStatusType } from '#/constants/status.constant';
import { CheckoutRes } from './checkout.interface';
import { VnpayMessage } from '#/constants/payment.constant';
import { VnpayService } from 'nestjs-vnpay';
import { InjectVnpay } from '#/common/decorators/inject-vnpay.decorator';
import { TransferPaymentDto } from './dto/transfer.dto';
import { isEmpty } from 'lodash';

@Injectable()
export class CheckoutService {
  constructor(
    private orderService: OrderService,
    @InjectVnpay() private readonly vnpayService: VnpayService,
  ) {}

  async checkVnpayPayment(userId: number, dto: VnpayPaymentDto): Promise<CheckoutRes> {
    const verify = this.vnpayService.instance.verifyReturnUrl(dto);
    if (!verify.isVerified) {
      throw new BadRequestException('Thông tin thanh toán không hợp lệ');
    }

    if (!verify.isSuccess) {
      return new CheckoutRes({
        success: false,
        message: 'Thanh toán không thành công',
        generic: VnpayMessage[verify.vnp_ResponseCode].generic || 'Thanh toán thất bại.',
        spec:
          VnpayMessage[verify.vnp_ResponseCode].spec ||
          'Vui lòng thử lại hoặc chọn phương thức thanh toán khác',
        orderCode: verify.vnp_OrderInfo,
      });
    } else {
      await this.orderService.updateOrderStatus(
        verify.vnp_OrderInfo,
        OrderStatusType.CONFIRMED,
        userId,
      );
      return new CheckoutRes({
        success: true,
        message: 'Đặt hàng thành công',
        generic: 'Thanh toán thành công.',
        spec: 'Cảm ơn quý khách đã mua hàng tại Korda Shop',
        orderCode: verify.vnp_OrderInfo,
      });
    }
  }

  async checkTransferPayment({ content, transferAmount }: TransferPaymentDto) {
    const orderCode = content.match(/[A-Z0-9]{16}/)[0];

    const order = await this.orderService.getOrderToCheckPayment(orderCode, transferAmount);

    if (isEmpty(order)) {
      return {
        success: false,
        message: 'Không tìm thấy đơn hàng hoặc số tiền không khớp',
      };
    } else {
      await this.orderService.updateOrderStatus(order.code, OrderStatusType.CONFIRMED);
      return {
        success: true,
      };
    }
  }
}
