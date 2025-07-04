import { CommonEntityUUID } from '#/common/entity/common.entity';
import { ProductVariant } from '#/modules/product-variant/entities/product-variant.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Cart } from './cart.entity';
import { Expose } from 'class-transformer';

@Entity()
export class CartItem extends CommonEntityUUID {
  @Column()
  quantity: number;

  @Expose({ name: 'product_id' })
  @PrimaryColumn()
  productId: number;

  @Expose({ name: 'cart_id' })
  @PrimaryColumn()
  cartId: number;

  @ManyToOne(() => ProductVariant)
  product: ProductVariant;

  @ManyToOne(() => Cart)
  cart: Relation<Cart>;
}
