import { CommonEntity } from '#/common/entity/common.entity';
import { Product } from '#/modules/product/entities/product.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, Relation } from 'typeorm';
import { ProductVariantOption } from './product-variant-option.entity';
import { Exclude, Expose } from 'class-transformer';
import { OrderItem } from '#/modules/order/entities/order-item.entity';

@Entity()
export class ProductVariant extends CommonEntity {
  @Column()
  price: number;

  @Expose({ name: 'original_price' })
  @Column({ nullable: true })
  originalPrice: number;

  @Column({ default: 0 })
  stock: number;

  @Expose({ name: 'image_url' })
  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column()
  name: string;

  @Exclude()
  @Column()
  productId: number;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  product: Relation<Product>;

  @ManyToMany(() => ProductVariantOption)
  @JoinTable({
    name: 'product_variant_values',
    joinColumn: { name: 'variant_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'option_id', referencedColumnName: 'id' },
  })
  variantValues: ProductVariantOption[];

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];
}
