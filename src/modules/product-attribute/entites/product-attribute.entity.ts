import { CommonEntity } from '#/common/entity/common.entity';
import { ProductAttributeGroup } from '#/modules/product-attribute-group/entities/product-attribute-group.entity';
import { ProductAttributeValue } from '#/modules/product/entities/product-attribute-value.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class ProductAttribute extends CommonEntity {
  @Column({ comment: 'Tên thuộc tính' })
  name: string;

  @Expose({ name: 'order_no' })
  @Column({ nullable: true, default: 0, comment: 'Thứ tự hiển thị' })
  orderNo: number;

  @Expose({ name: 'is_selected' })
  @Column({ nullable: true, default: false, comment: 'Thuộc tính nổi bật' })
  isSelected: boolean;

  @ManyToOne(() => ProductAttributeGroup, {
    onDelete: 'SET NULL',
    cascade: true,
    createForeignKeyConstraints: false,
  })
  group: ProductAttributeGroup;

  @OneToMany(() => ProductAttributeValue, (value) => value.attribute)
  attributeValues: ProductAttributeValue[];
}
