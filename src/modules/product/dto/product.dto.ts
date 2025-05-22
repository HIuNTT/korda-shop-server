import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductAttributeValueDto } from './product-attribute-value.dto';
import { ProductImageDto } from './product-image.dto';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsNotEmpty()
  @IsString()
  productState: string;

  @ApiProperty({
    name: 'included_accessories',
    description: 'Phụ kiện kèm theo',
    example: 'Cáp, sạc, sách hdsd',
  })
  @Expose({ name: 'included_accessories' })
  @IsNotEmpty()
  @IsString()
  includedAccessories: string;

  @ApiProperty({
    name: 'warranty_information',
    description: 'Thông tin bảo hành',
    example:
      'Bảo hành 24 tháng tại trung tâm bảo hành Chính hãng. 1 đổi 1 trong 30 ngày nếu có lỗi phần cứng từ nhà sản xuất.',
  })
  @Expose({ name: 'warranty_information' })
  @IsNotEmpty()
  @IsString()
  warrantyInformation: string;

  @ApiProperty({
    name: 'tax_vat',
    description: 'Giá sản phẩm đã bao gồm thuế VAT hay chưa?',
    default: true,
  })
  @Expose({ name: 'tax_vat' })
  @IsBoolean()
  taxVat: boolean;

  @ApiProperty({ description: 'Số lượng sản phẩm trong kho' })
  @IsNumber()
  stock: number;

  @ApiProperty({ description: 'Giá sản phẩm' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Giá gốc sản phẩm', name: 'original_price' })
  @Expose({ name: 'original_price' })
  @IsNumber()
  originalPrice: number;

  @ApiProperty({ description: 'Danh sách ID của danh mục', name: 'category_ids', type: [Number] })
  @Expose({ name: 'category_ids' })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  categoryIds: number[];

  @ApiProperty({ description: 'Danh sách hình ảnh sản phẩm', type: [ProductImageDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @ApiProperty({ description: 'Danh sách thuộc tính sản phẩm', type: [ProductAttributeValueDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeValueDto)
  attributes: ProductAttributeValueDto[];
}
