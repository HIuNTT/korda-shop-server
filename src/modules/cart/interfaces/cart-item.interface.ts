import { Variant } from '#/modules/product/interfaces/product.interface';
import { PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CartProductVariant extends PickType(Variant, ['id', 'color', 'stock']) {
  image: string;
  name: string;
}

export class CartProduct {
  id: string;
  name: string;
  image: string;
  slug: string;
  stock: number;

  @Expose({ name: 'variant_id' })
  variantId: number;
  quantity: number;

  @Type(() => CartProductVariant)
  variants: CartProductVariant[];
  price: number;

  @Expose({ name: 'original_price' })
  originalPrice: number;
}
