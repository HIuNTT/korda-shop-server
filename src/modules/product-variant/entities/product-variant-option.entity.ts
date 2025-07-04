import { CommonEntity } from '#/common/entity/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ProductVariantType } from './product-variant-type.entity';
import { Expose } from 'class-transformer';

@Entity()
export class ProductVariantOption extends CommonEntity {
  @Column()
  name: string;

  @Expose({ name: 'order_no' })
  @Column({ default: 0 })
  orderNo: number;

  @ManyToOne(() => ProductVariantType, (variant) => variant.variantOptions, {
    onDelete: 'CASCADE',
  })
  variant: ProductVariantType;
}
