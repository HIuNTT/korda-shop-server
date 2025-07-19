import { CommonEntity } from '#/common/entity/common.entity';
import { Category } from '#/modules/category/entities/category.entity';
import { ProductAttribute } from '#/modules/product-attribute/entites/product-attribute.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class ProductAttributeGroup extends CommonEntity {
  @ApiProperty({ description: 'Tên nhóm thuộc tính' })
  @Column()
  name: string;

  @ApiProperty({ name: 'order_no', description: 'Thứ tự hiển thị' })
  @Expose({ name: 'order_no' })
  @Column({ nullable: true, default: 0 })
  orderNo: number;

  @ApiProperty({ name: 'is_filter', description: 'Nhóm thuộc tính dùng để lọc' })
  @Expose({ name: 'is_filter' })
  @Column({ nullable: true, default: false })
  isFilter: boolean;

  @ApiHideProperty()
  @ManyToMany(() => Category, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => ProductAttribute, (attribute) => attribute.group)
  attributes: ProductAttribute[];
}
