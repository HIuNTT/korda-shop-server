import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { AttributeGroupHasMap, DefaultAttribute } from './attribute.interface';
import { Expose, Type } from 'class-transformer';

export class Breadcrumb {
  @ApiProperty({ description: 'Đường dẫn đến danh mục' })
  path: string;

  @ApiProperty({ description: 'Tên danh mục' })
  name: string;
}

export class ProductBySlug extends OmitType(Product, ['attributes', 'ratingSum' as const]) {
  @ApiProperty({ name: 'discount_percent', description: 'Phần trăm giảm giá' })
  @Expose({ name: 'discount_percent' })
  discountPercent: number;

  @ApiProperty({ name: 'aggregate_rating', description: 'Điểm đánh giá trung bình' })
  @Expose({ name: 'aggregate_rating' })
  aggregateRating: number;

  @ApiProperty({
    name: 'attribute_items',
    description: 'Danh sách thuộc tính phân chia theo nhóm',
    type: [AttributeGroupHasMap],
  })
  @Expose({ name: 'attribute_items' })
  @Type(() => AttributeGroupHasMap)
  attributeItems: AttributeGroupHasMap[];

  @ApiProperty({
    name: 'default_attributes',
    description: 'Danh sách thuộc tính mặc định',
    type: [DefaultAttribute],
  })
  @Expose({ name: 'default_attributes' })
  @Type(() => DefaultAttribute)
  defaultAttributes: DefaultAttribute[];

  @ApiProperty({ description: 'Breadcrumb', type: [Breadcrumb] })
  @Type(() => Breadcrumb)
  breadcrumbs: Breadcrumb[];

  constructor(partial?: Partial<ProductBySlug>) {
    super();
    Object.assign(this, partial);
  }
}
