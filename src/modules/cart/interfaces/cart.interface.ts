import { Expose, Type } from 'class-transformer';
import { CartProduct } from './cart-item.interface';

export class CartPrices {
  @Expose({ name: 'total_discount' })
  totalDiscount: number;

  total: number;

  @Expose({ name: 'total_voucher_price' })
  totalVoucherPrice: number;

  @Expose({ name: 'estimated_price' })
  estimatedPrice: number;
}

export class CartInfo {
  @Type(() => CartProduct)
  products: CartProduct[];

  @Type(() => CartPrices)
  prices: CartPrices;

  constructor(partial: Partial<CartInfo>) {
    Object.assign(this, partial);
  }
}
