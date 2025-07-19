import { CommonEntity } from '#/common/entity/common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { Expose } from 'class-transformer';

@Entity()
export class ProductAttributeOption extends CommonEntity {
  @ApiProperty({ description: 'Tên giá trị của thuộc tính' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Mô tả giá trị của thuộc tính' })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Thứ tự hiển thị' })
  @Expose({ name: 'order_no' })
  @Column({ nullable: true, default: 0 })
  orderNo: number;

  @ManyToOne(() => ProductAttribute, (attribute) => attribute.attributeOptions, {
    onDelete: 'CASCADE',
  })
  attribute: Relation<ProductAttribute>;
}
