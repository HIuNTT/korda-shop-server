import { CommonEntity } from '#/common/entity/common.entity';
import { ProductAttributeGroup } from '#/modules/product-attribute-group/entities/product-attribute-group.entity';
import { ProductAttributeValue } from '#/modules/product/entities/product-attribute-value.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { ProductAttributeOption } from './product-attribute-option.entity';
import { InputType } from '#/constants/input-type.constant';

@Entity()
export class ProductAttribute extends CommonEntity {
  @Column({ nullable: true })
  key: string;

  @Column({ comment: 'Tên thuộc tính' })
  name: string;

  @Expose({ name: 'order_no' })
  @Column({ nullable: true, default: 0, comment: 'Thứ tự hiển thị' })
  orderNo: number;

  @Expose({ name: 'is_selected' })
  @Column({ nullable: true, default: false, comment: 'Thuộc tính nổi bật' })
  isSelected: boolean;

  @Expose({ name: 'is_display' })
  @Column({ nullable: true, default: true, comment: 'Thuộc tính hiển thị' })
  isDisplay: boolean;

  @Expose({ name: 'is_key_selling' })
  @Column({ nullable: true, default: false })
  isKeySelling: boolean;

  @Column({ nullable: true, default: false, comment: 'Thuộc tính dùng để lọc' })
  @Expose({ name: 'is_filter' })
  isFilter: boolean;

  @Expose({ name: 'is_required' })
  @Column({ nullable: true, default: false })
  isRequired: boolean;

  @Expose({ name: 'input_type' })
  @Column({
    default: InputType.TEXT_FIELD,
    type: 'enum',
    enum: InputType,
    comment: 'Loại nhập liệu',
  })
  inputType: InputType; // 0: text field, 1: text area, 2: dropdown, 3: multiple selection

  @Column({ nullable: true })
  description: string;

  @ApiHideProperty()
  @ManyToOne(() => ProductAttributeGroup, (group) => group.attributes, {
    onDelete: 'SET NULL',
    cascade: true,
    createForeignKeyConstraints: false,
  })
  group: Relation<ProductAttributeGroup>;

  @ApiHideProperty()
  @OneToMany(() => ProductAttributeValue, (value) => value.attribute)
  attributeValues?: ProductAttributeValue[];

  @Expose({ name: 'options' })
  @OneToMany(() => ProductAttributeOption, (option) => option.attribute, {
    cascade: true,
  })
  attributeOptions?: ProductAttributeOption[];
}
