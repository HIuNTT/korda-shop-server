import { CommonEntityUUID } from '#/common/entity/common.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { Product } from './product.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class ProductImage extends CommonEntityUUID {
  @Column({ type: 'text' })
  url: string;

  @Expose({ name: 'order_no' })
  @Column({ nullable: true, default: 0 })
  orderNo: number;

  @ApiHideProperty()
  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product: Relation<Product>;
}
