import { CommonEntity } from '#/common/entity/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity()
export class ProductGroup extends CommonEntity {
  @ApiProperty({ description: 'Tên nhóm sản phẩm' })
  @Column()
  name: string;

  @ApiHideProperty()
  @OneToMany(() => Product, (product) => product.group)
  products: Product[];
}
