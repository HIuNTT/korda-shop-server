import { CommonEntity } from '#/common/entity/common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { ProductVariantOption } from './product-variant-option.entity';
import { Expose } from 'class-transformer';

@Entity()
export class ProductVariantType extends CommonEntity {
  @ApiProperty({ description: 'Tên của loại biến thể sản phẩm' })
  @Column()
  name: string;

  @Expose({ name: 'options' })
  @OneToMany(() => ProductVariantOption, (option) => option.variant, {
    cascade: true,
  })
  variantOptions: ProductVariantOption[];
}
