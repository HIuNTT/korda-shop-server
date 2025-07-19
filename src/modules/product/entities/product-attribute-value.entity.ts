import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, Relation } from 'typeorm';
import { Product } from './product.entity';
import { ProductAttribute } from '#/modules/product-attribute/entites/product-attribute.entity';

@Entity()
export class ProductAttributeValue extends BaseEntity {
  @Column({ comment: 'Giá trị thuộc tính' })
  value: string;

  @PrimaryColumn()
  productId: number;

  @PrimaryColumn()
  attributeId: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Relation<Product>;

  @ManyToOne(() => ProductAttribute, { onDelete: 'CASCADE' })
  attribute: Relation<ProductAttribute>;
}
