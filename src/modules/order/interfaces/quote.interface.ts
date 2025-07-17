import { CartPrices } from '#/modules/cart/interfaces/cart.interface';
import { Expose, Type } from 'class-transformer';
import { Quote } from '../entities/quote.entity';

export class QuotePrices extends CartPrices {
  @Expose({ name: 'estimated_shipping_price' })
  estimatedShippingPrice: number;
}

export class QuoteProduct {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;

  @Expose({ name: 'original_price' })
  originalPrice: number;
}

export class QuoteInfo extends Quote {
  @Type(() => QuoteProduct)
  products: QuoteProduct[];

  @Type(() => QuotePrices)
  prices: QuotePrices;

  constructor(partial?: Partial<QuoteInfo>) {
    super();
    Object.assign(this, partial);
  }
}
