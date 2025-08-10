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

export class MyOrderProducts {
  @Expose({ name: 'product_id' })
  productId: number;

  @Expose({ name: 'variant_id' })
  variantId: number;

  quantity: number;
  price: number;

  @Expose({ name: 'original_price' })
  originalPrice: number;

  @Expose({ name: 'image_url' })
  imageUrl: string;

  @Expose({ name: 'product_name' })
  productName: string;

  stock: number;

  @Expose({ name: 'variant_name' })
  variantName: string;

  slug: string;
}

export class MyOrderAddress {
  @Expose({ name: 'shipping_name' })
  shippingName: string;

  @Expose({ name: 'shipping_phone' })
  shippingPhone: string;

  @Expose({ name: 'shipping_address' })
  shippingAddress: string;
}

export class MyOrderPaymentMethod extends PickType(PaymentMethod, [
  'id',
  'key',
  'name',
  'imageUrl',
] as const) {}

export class MyOrderProcessing {
  @Expose({ name: 'create_time' })
  createTime: Date;

  @Expose({ name: 'confirm_time' })
  confirmTime?: Date;

  @Expose({ name: 'delivery_time' })
  deliveryTime?: Date;

  @Expose({ name: 'complete_time' })
  completeTime?: Date;

  @Expose({ name: 'is_rated' })
  isRated?: boolean;

  @Expose({ name: 'rating_time' })
  ratingTime?: Date;

  @Expose({ name: 'cancel_time' })
  cancelTime?: Date;
}

export class MyOrderDetail extends PickType(Order, [
  'id',
  'code',
  'note',
  'subtotalPrice',
  'totalPrice',
  'shippingPrice',
  'voucherPrice',
  'createdAt',
] as const) {
  status: OrderStatusType;

  @Type(() => MyOrderProducts)
  products: MyOrderProducts[];

  @Type(() => OrderFlags)
  flags: OrderFlags;

  @Type(() => MyOrderAddress)
  address: MyOrderAddress;

  @Expose({ name: 'payment_method' })
  @Type(() => MyOrderPaymentMethod)
  paymentMethod: MyOrderPaymentMethod;

  @Type(() => MyOrderProcessing)
  processing: MyOrderProcessing;

  constructor(partial?: Partial<MyOrderDetail>) {
    super();
    Object.assign(this, partial);
  }
}
