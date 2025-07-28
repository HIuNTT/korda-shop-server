import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateProductAttributeDto } from './product-attribute-value.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImageDto } from './product-image.dto';
import { ProductVariantValuesDto, ProductVariationListDto } from './product-variant.dto';

export class ProductDto {
  @ApiProperty({ description: 'Tên sản phẩm' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Mô tả sản phẩm' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Đặc điểm nổi bật của sản phẩm', name: 'highlight_features' })
  @Expose({ name: 'highlight_features' })
  @IsNotEmpty()
  @IsString()
  highlightFeatures: string;

  @ApiProperty({
    name: 'product_state',
    description: 'Trạng thái sản phẩm',
    example:
      'Nguyên hộp, đầy đủ phụ kiện từ nhà sản xuất\u003cbr\u003e Bảo hành pin và bộ sạc 12 tháng',
  })
  @Expose({ name: 'product_state' })
  @IsString()
  @IsOptional()
  productState?: string;

  @ApiProperty({
    name: 'included_accessories',
    description: 'Phụ kiện kèm theo',
    example: 'Cáp, sạc, sách hdsd',
  })
  @Expose({ name: 'included_accessories' })
  @IsString()
  @IsOptional()
  includedAccessories?: string;

  @ApiProperty({
    name: 'warranty_information',
    description: 'Thông tin bảo hành',
    example:
      'Bảo hành 24 tháng tại trung tâm bảo hành Chính hãng. 1 đổi 1 trong 30 ngày nếu có lỗi phần cứng từ nhà sản xuất.',
  })
  @Expose({ name: 'warranty_information' })
  @IsString()
  @IsOptional()
  warrantyInformation?: string;

  @ApiProperty({
    name: 'tax_vat',
    description: 'Giá sản phẩm đã bao gồm thuế VAT hay chưa?',
    default: true,
  })
  @Expose({ name: 'tax_vat' })
  @IsBoolean()
  @IsOptional()
  taxVat?: boolean;

  @ApiProperty({ description: 'Tên phụ của sản phẩm', name: 'secondary_name' })
  @Expose({ name: 'secondary_name' })
  @IsString()
  @IsOptional()
  secondaryName?: string;

  @ApiProperty({
    description: 'Tên liên quan của sản phẩm, dùng để chọn các phiên bản',
    name: 'related_name',
  })
  @Expose({ name: 'related_name' })
  @IsString()
  @IsOptional()
  relatedName?: string;

  @ApiProperty({ description: 'Danh sách ID của danh mục', name: 'category_ids', type: [Number] })
  @Expose({ name: 'category_ids' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  categoryIds: number[];

  @ApiProperty({
    name: 'group_id',
    description:
      'ID của nhóm sản phẩm, được dùng để nhóm các sản phẩm cùng loại nhưng khác CPU, RAM, bộ nhớ - phân thành các phiên bản khác nhau',
  })
  @Expose({ name: 'group_id' })
  @IsInt()
  @Min(0)
  @IsOptional()
  groupId?: number;

  @ApiProperty({ description: 'Danh sách key hình ảnh sản phẩm', type: [ProductImageDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @ApiProperty({ description: 'Danh sách thuộc tính sản phẩm', type: [CreateProductAttributeDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProductAttributeDto)
  attributes: CreateProductAttributeDto[];

  @ApiProperty({
    name: 'variant_values',
    description: 'Danh sách các biến thể của sản phẩm gồm giá, kho hàng, ảnh',
  })
  @Expose({ name: 'variant_values' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantValuesDto)
  variantValues: ProductVariantValuesDto[];

  @ApiProperty({ name: 'variation_list', description: 'Danh sách các loại biến thể của sản phẩm' })
  @Expose({ name: 'variation_list' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariationListDto)
  @IsOptional()
  variationList?: ProductVariationListDto[];
}

export class GetProductAttributesDto {
  @ApiProperty({
    name: 'category_ids',
    description: 'Danh sách ID của danh mục cấp cuối',
    type: [Number],
  })
  @Expose({ name: 'category_ids' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  categoryIds: number[];
}

export class GetProductDetailDto {
  @ApiProperty({
    name: 'slug',
    description: 'Slug của sản phẩm',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
