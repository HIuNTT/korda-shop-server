import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreateOrderRes {
  @ApiProperty({ name: 'order_code', description: 'Mã đơn hàng' })
  @Expose({ name: 'order_code' })
  orderCode: string;

  @ApiProperty({ name: 'payment_method', description: 'Phương thức thanh toán' })
  @Expose({ name: 'payment_method' })
  paymentMethod: string;

  @ApiProperty({ name: 'qr_code', description: 'Mã QR thanh toán' })
  @Expose({ name: 'qr_code' })
  qrCode?: string;

  @ApiProperty({
    name: 'payment_url',
    description: 'URL thanh toán của bên trung gian. VD: sandbox vnpay',
  })
  @Expose({ name: 'payment_url' })
  paymentUrl?: string;

  constructor(partial?: Partial<CreateOrderRes>) {
    Object.assign(this, partial);
  }
}
