import { CommonEntityUUID } from '#/common/entity/common.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { Product } from './product.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity()
export class ProductImage extends CommonEntityUUID {
  @Column({ type: 'text' })
  @ApiProperty({ description: 'URL của ảnh sản phẩm' })
  url: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Key của ảnh sản phẩm, là tên blob trên azure storage' })
  key: string;

  @Expose({ name: 'order_no' })
  @Column({ nullable: true, default: 0 })
  @ApiProperty({ name: 'order_no', description: 'Thứ tự hiển thị của ảnh sản phẩm' })
  orderNo: number;

  @ApiHideProperty()
  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  product: Relation<Product>;
}
