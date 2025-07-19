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

export class ProductVersion {
  @ApiProperty({ description: 'Slug của sản phẩm' })
  slug: string;

  @ApiProperty({ description: 'Tên phiên bản của sản phẩm' })
  name: string;

  @ApiProperty({ description: 'Giá hiện tại của sản phẩm' })
  price: number;
}

export class Variant {
  @ApiProperty({ description: 'ID của biến thể sản phẩm' })
  id: number;

  @ApiProperty({ description: 'Url của hình ảnh biến thể sản phẩm' })
  @Expose({ name: 'image_url' })
  imageUrl: string;

  @ApiProperty({
    description: 'Màu sắc của biến thể sản phẩm (Trường hợp chỉ có 1 biến thể màu sắc)',
  })
  color: string;

  @ApiProperty({ description: 'Giá hiện tại sản phẩm' })
  price: number;

  @ApiProperty({ description: 'Giá gốc của sản phẩm' })
  @Expose({ name: 'original_price' })
  originalPrice: number;

  @ApiProperty({ description: 'Phần trăm giảm giá' })
  @Expose({ name: 'discount_percent' })
  discountPercent: number;

  @ApiProperty({ description: 'Số lượng tồn kho của biến thể sản phẩm' })
  stock: number;

  @ApiProperty({ description: 'Là mặc định hay không?' })
  @Expose({ name: 'is_default' })
  isDefault: boolean;
}

export class ProductBySlug extends OmitType(Product, [
  'attributes',
  'ratingSum',
  'attributeValueOptions',
  'variants',
  'group' as const,
]) {
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

  @ApiProperty({
    name: 'product_versions',
    description: 'Danh sách phiên bản sản phẩm',
    type: [ProductVersion],
  })
  @Expose({ name: 'product_versions' })
  @Type(() => ProductVersion)
  productVersions: ProductVersion[];

  @ApiProperty({ description: 'Danh sách biến thể sản phẩm', type: [Variant] })
  @Type(() => Variant)
  variants: Variant[];

  constructor(partial?: Partial<ProductBySlug>) {
    super();
    Object.assign(this, partial);
  }
}
