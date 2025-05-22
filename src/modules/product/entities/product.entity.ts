import { CommonEntity } from '#/common/entity/common.entity';
import { Category } from '#/modules/category/entities/category.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ProductAttributeValue } from './product-attribute-value.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product extends CommonEntity {
  @Column()
  @ApiProperty({ description: 'Tên sản phẩm' })
  name: string;

  @Column()
  @ApiProperty({ description: 'Slug sản phẩm' })
  slug: string;

  @Expose({ name: 'thumbnail_url' })
  @Column()
  @ApiProperty({ name: 'thumbnail_url', description: 'Url ảnh đại diện sản phẩm' })
  thumbnailUrl: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'Mô tả sản phẩm' })
  description: string;

  @Expose({ name: 'highlight_features' })
  @Column({ type: 'text', comment: 'Đặc điểm nổi bật' })
  @ApiProperty({ name: 'highlight_features', description: 'Đặc điểm nổi bật' })
  highlightFeatures: string;

  @Expose({ name: 'product_state' })
  @Column({ type: 'text' })
  @ApiProperty({
    name: 'product_state',
    description: 'Trạng thái sản phẩm',
  })
  productState: string;

  @Expose({ name: 'included_accessories' })
  @Column({ type: 'text' })
  @ApiProperty({
    name: 'included_accessories',
    description: 'Phụ kiện kèm theo',
  })
  includedAccessories: string;

  @Expose({ name: 'warranty_information' })
  @Column({ type: 'text' })
  @ApiProperty({
    name: 'warranty_information',
    description: 'Thông tin bảo hành',
  })
  warrantyInformation: string;

  @Expose({ name: 'tax_vat' })
  @Column({ default: true })
  @ApiProperty({
    name: 'tax_vat',
    description: 'Giá sản phẩm đã bao gồm thuế VAT hay chưa?',
    default: true,
  })
  taxVat: boolean;

  @Column({ comment: 'Số lượng trong kho' })
  @ApiProperty({ description: 'Số lượng trong kho' })
  stock: number;

  @Expose({ name: 'quantity_sold' })
  @Column({ default: 0, comment: 'Số lượng đã bán' })
  @ApiProperty({ name: 'quantity_sold', description: 'Số lượng đã bán' })
  quantitySold: number;

  @Column()
  @ApiProperty({ description: 'Giá sản phẩm' })
  price: number;

  @Expose({ name: 'original_price' })
  @Column({ default: 0 })
  @ApiProperty({ name: 'original_price', description: 'Giá gốc sản phẩm' })
  originalPrice: number;

  @Expose({ name: 'rating_sum' })
  @Column({ default: 0 })
  @ApiProperty({ name: 'rating_sum', description: 'Tổng điểm đánh giá' })
  ratingSum: number;

  @Expose({ name: 'review_count' })
  @Column({ default: 0 })
  reviewCount: number;

  @Expose({ name: 'is_actived' })
  @Column({ default: true })
  isActived: boolean;

  @ManyToMany(() => Category, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
  })
  images: ProductImage[];

  @OneToMany(() => ProductAttributeValue, (value) => value.product)
  attributes: ProductAttributeValue[];
}
