import { CommonEntity } from '#/common/entity/common.entity';
import { Category } from '#/modules/category/entities/category.entity';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ProductAttributeValue } from './product-attribute-value.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductAttributeOption } from '#/modules/product-attribute/entites/product-attribute-option.entity';
import { ProductVariant } from '#/modules/product-variant/entities/product-variant.entity';
import { ProductGroup } from '#/modules/product-group/product-group.entity';

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
  @Column({ nullable: true, type: 'text' })
  @ApiProperty({
    name: 'product_state',
    description: 'Trạng thái sản phẩm',
  })
  productState?: string;

  @Expose({ name: 'included_accessories' })
  @Column({ nullable: true, type: 'text' })
  @ApiProperty({
    name: 'included_accessories',
    description: 'Phụ kiện kèm theo',
  })
  includedAccessories?: string;

  @Expose({ name: 'warranty_information' })
  @Column({ nullable: true, type: 'text' })
  @ApiProperty({
    name: 'warranty_information',
    description: 'Thông tin bảo hành',
  })
  warrantyInformation?: string;

  @Expose({ name: 'tax_vat' })
  @Column({ nullable: true, default: true })
  @ApiProperty({
    name: 'tax_vat',
    description: 'Giá sản phẩm đã bao gồm thuế VAT hay chưa?',
    default: true,
  })
  taxVat?: boolean;

  @ApiProperty({ name: 'secondary_name', description: 'Tên phụ của sản phẩm' })
  @Expose({ name: 'secondary_name' })
  @Column({ nullable: true, type: 'text' })
  secondaryName?: string;

  @ApiProperty({ name: 'related_name', description: 'Tên liên quan của sản phẩm' })
  @Expose({ name: 'related_name' })
  @Column({ nullable: true })
  relatedName?: string;

  @Column({ comment: 'Số lượng trong kho', default: 0 })
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
  @ApiProperty({ name: 'review_count', description: 'Số lượng đánh giá' })
  reviewCount: number;

  @Expose({ name: 'is_actived' })
  @Column({ default: true })
  @ApiProperty({ name: 'is_actived', description: 'Trạng thái kích hoạt sản phẩm' })
  isActived: boolean;

  @ManyToMany(() => Category, {
    cascade: true,
  })
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => ProductGroup, (group) => group.products, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  group: ProductGroup;

  @OneToMany(() => ProductImage, (image) => image.product, {
    cascade: true,
  })
  images: ProductImage[];

  @OneToMany(() => ProductAttributeValue, (value) => value.product)
  attributes: ProductAttributeValue[];

  @ManyToMany(() => ProductAttributeOption, {
    cascade: true,
  })
  @JoinTable({
    name: 'product_attribute_option_values',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'option_id',
      referencedColumnName: 'id',
    },
  })
  attributeValueOptions: ProductAttributeOption[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];
}
