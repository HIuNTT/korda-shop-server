import { CommonEntity } from '#/common/entity/common.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from '#/modules/product-variant/entities/product-variant.entity';

@Entity()
export class OrderItem extends CommonEntity {
  @Expose({ name: 'order_id' })
  @PrimaryColumn()
  orderId: number;

  @Expose({ name: 'product_id' })
  @PrimaryColumn()
  productId: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Expose({ name: 'original_price' })
  @Column({ default: 0 })
  originalPrice: number;

  @ManyToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => ProductVariant)
  product: Relation<ProductVariant>;
}
