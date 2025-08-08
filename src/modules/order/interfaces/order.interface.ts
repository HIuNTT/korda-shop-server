import { PaymentMethod } from '#/modules/payment/payment-method/entities/payment-method.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Order } from '../entities/order.entity';
import { OrderStatusType } from '#/constants/status.constant';

export class CreateOrderRes {
  @ApiProperty({ name: 'order_code', description: 'Mã đơn hàng' })
  @Expose({ name: 'order_code' })
  orderCode: string;

  @ApiProperty({ name: 'total_price', description: 'Tổng giá trị đơn hàng' })
  @Expose({ name: 'total_price' })
  totalPrice: number;

  @ApiProperty({
    name: 'payment_method',
    description: 'Phương thức thanh toán',
    type: PaymentMethod,
  })
  @Expose({ name: 'payment_method' })
  @Type(() => PaymentMethod)
  paymentMethod: PaymentMethod;

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

export class MyOrderItem {
  @Expose({ name: 'item_id' })
  itemId: number;

  @Expose({ name: 'variant_id' })
  variantId: number;

  quantity: number;
  price: number;

  @Expose({ name: 'original_price' })
  originalPrice: number;

  @Expose({ name: 'image_url' })
  imageUrl: string;

  @Expose({ name: 'item_name' })
  itemName: string;

  stock: number;

  @Expose({ name: 'variant_name' })
  variantName: string;
}

export class OrderFlags {
  @Expose({ name: 'is_re_buy' })
  isReBuy?: boolean;

  @Expose({ name: 'is_cancel' })
  isCancel?: boolean;

  @Expose({ name: 'is_return' })
  isReturn?: boolean;

  @Expose({ name: 'is_review' })
  isReview?: boolean;

  @Expose({ name: 'is_repayment' })
  isRepayment?: boolean;
}

export class MyOrder extends PickType(Order, [
  'id',
  'code',
  'subtotalPrice',
  'totalPrice',
  'shippingPrice',
  'voucherPrice',
  'createdAt',
] as const) {
  status: OrderStatusType;
  count: number;

  @Type(() => MyOrderItem)
  details: MyOrderItem[];

  @Type(() => OrderFlags)
  flags: OrderFlags;

  constructor(partial?: Partial<MyOrder>) {
    super();
    Object.assign(this, partial);
  }
}
